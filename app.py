import datetime
import json
import os
import secrets

from flask import Flask, g, jsonify, redirect, request, send_from_directory, session

from tripbox import emails
from tripbox.models import (
    AuthToken,
    Item,
    Trip,
    TripItem,
    User,
    UserTrip,
    add_user_to_trip,
    create_item,
    create_trip,
    database,
    get_or_404,
    get_or_create_user,
)

BASE_URL = os.environ["BASE_URL"]
USE_DEMO_LOGIN = bool(os.environ.get("USE_DEMO_LOGIN"))

app = Flask(__name__, static_folder="./build")
app.secret_key = os.environ.get("SECRET_KEY")
app.permanent_session_lifetime = datetime.timedelta(days=60)


def get_current_user():
    return User.get(User.email == session["user_email"])


@app.before_request
def before_request():
    g.db = database
    g.db.connect()


@app.after_request
def after_request(resp):
    g.db.close()
    if request.origin in ["http://localhost:3000", BASE_URL]:
        resp.headers["Access-Control-Allow-Origin"] = request.origin
        resp.headers["Access-Control-Allow-Credentials"] = "true"
        resp.headers["Access-Control-Allow-Headers"] = "content-type"
        resp.headers["Access-Control-Allow-Methods"] = "PUT,POST,GET,DELETE"
    return resp


def gen_token():
    return secrets.token_urlsafe(32)


def auth_user(session, email):
    user = get_or_create_user(email)
    session.permanent = True
    session["user_email"] = email
    return user


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


def send_login_email(email):
    token = gen_token()
    secret = gen_token()
    session["auth_token"] = token
    AuthToken.create(auth_token=token, auth_secret=secret, email=email)
    emails.send_email(
        email,
        "Login to TripBox",
        'Click this link to login: <a href="{}">Login to TripBox</a>'.format(
            BASE_URL + "/api/auth_with_secret?secret=" + secret
        ),
    )


def send_invite_email(from_email, email, trip, viewer_only):
    token = gen_token()
    secret = gen_token()
    AuthToken.create(
        auth_token=token, auth_secret=secret, email=email, join_trip_id=trip.trip_id, join_as_viewer=viewer_only
    )
    emails.send_email(
        email,
        "Login to TripBox to join " + trip.name,
        'You were invited by {} to join TripBox. Click this link to login: <a href="{}">Login to TripBox</a>'.format(
            from_email, BASE_URL + "/api/auth_with_secret?secret=" + secret
        ),
    )


@app.route("/api/login", methods=["POST"])
def login():
    if USE_DEMO_LOGIN:
        auth_user(session, "example@example.com")
    else:
        email = request.json["email"]
        send_login_email(email)
    return jsonify(dict(success=True))


@app.route("/api/auth_with_secret")
def auth_with_secret():
    secret = request.args["secret"]
    auth_token = get_or_404(AuthToken, AuthToken.auth_secret == secret)
    if not auth_token.authed:
        auth_token.authed = True
        auth_token.save()
    user = auth_user(session, auth_token.email)
    add_user_to_trip(user, auth_token.join_trip_id, viewer_only=auth_token.join_as_viewer)
    return redirect(BASE_URL)


@app.route("/api/auth_poll")
def auth_poll():
    if session.get("user_email"):
        return jsonify(dict(success=True))
    auth_token = get_or_404(AuthToken, AuthToken.auth_token == session["auth_token"])
    if auth_token.authed:
        session.pop("auth_token")
        auth_user(session, auth_token.email)
        return jsonify(dict(success=True))
    return jsonify(dict(success=False))


@app.route("/api/context")
def context():
    if not session.get("user_email"):
        return jsonify({})
    user = get_current_user()
    return jsonify(dict(user=user.to_json()))


@app.route("/api/trips", methods=["POST"])
def post_trip():
    user = get_current_user()
    trip = create_trip(user, request.json["name"])
    return jsonify(trip.to_json())


@app.route("/api/trips")
def get_trip():
    trip_id = request.args.get("trip_id")
    if trip_id is not None:
        trip = get_or_404(Trip, Trip.trip_id == trip_id)
        return jsonify(trip.to_json_with_items())
    else:
        user = get_current_user()
        trips = [trip.to_json() for trip in Trip.select().join(UserTrip).where(UserTrip.user == user)]
        return jsonify(trips)


@app.route("/api/items", methods=["PUT"])
def put_item():
    item_id = request.args.get("item_id")
    item = get_or_404(Item, Item.item_id == item_id)
    item.title = request.json["title"]
    item.props = request.json["props"]
    item.tags = request.json["tags"]
    item.save()
    return jsonify(item.to_json())


@app.route("/api/items", methods=["DELETE"])
def delete_item():
    item_id = request.args.get("item_id")
    item = get_or_404(Item, Item.item_id == item_id)
    with database.atomic():
        TripItem.delete().where(TripItem.item == item).execute()
        item.delete_instance()
    return jsonify(dict(success=True))


@app.route("/api/invite", methods=["POST"])
def invite():
    user = get_current_user()
    trip_id = request.json.get("trip_id")
    trip = get_or_404(Trip, Trip.trip_id == trip_id)
    email = request.json.get("email")
    viewer_only = request.json.get("viewer_only")
    send_invite_email(user.email, email, trip, viewer_only)
    return jsonify(dict(success=True))


@app.route("/api/kick", methods=["POST"])
def kick():
    trip_id = request.json.get("trip_id")
    email = request.json.get("email")
    user_trip = (
        UserTrip.select().join(User).where(UserTrip.trip == trip_id, User.email == email, UserTrip.owner == False).get()
    )
    user_trip.delete_instance()
    return jsonify(dict(success=True))


@app.route("/api/inbound_email", methods=["POST"])
def inbound_email():
    email_data = dict(request.form)
    for inbox in json.loads(email_data["envelope"])["to"]:
        if inbox.endswith("tripbox.sshh.io"):
            add_item_from_inbound_email(inbox, email_data)
    return ""


def add_item_from_inbound_email(inbox_email, email_data):
    trip = get_or_404(Trip, Trip.inbox_email == inbox_email)
    title = email_data["subject"].replace("Fwd: ", "")
    from_email = json.loads(email_data["envelope"])["from"]
    create_item(trip, title, tags=["by:" + from_email], props={"email": email_data})


if __name__ == "__main__":
    app.run(use_reloader=True, port=5000)
