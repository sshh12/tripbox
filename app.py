import datetime
import json
import os

from flask import (
    Flask,
    abort,
    g,
    jsonify,
    redirect,
    request,
    send_from_directory,
    session,
)

from tripbox.constants import BASE_URL, DEV_URL, USE_DEMO_LOGIN
from tripbox.models import database
from tripbox.models_crud import (
    add_item_from_inbound_email,
    auth_session_if_token_used,
    auth_session_with_email,
    auth_session_with_secret,
    create_item,
    create_trip,
    delete_item,
    delete_trip,
    get_item,
    get_session_user,
    get_trip,
    get_trip_for_item,
    get_trip_for_user,
    invite_user_to_trip,
    remove_user_from_trip,
    send_login_email,
    update_item,
    update_trip,
    user_can_view_trip,
)

app = Flask(__name__, static_folder="./build")
app.secret_key = os.environ.get("SECRET_KEY")
app.permanent_session_lifetime = datetime.timedelta(days=60)


@app.before_request
def before_request():
    g.db = database
    g.db.connect()


@app.after_request
def after_request(resp):
    g.db.close()
    if request.origin in [DEV_URL, BASE_URL]:
        resp.headers["Access-Control-Allow-Origin"] = request.origin
        resp.headers["Access-Control-Allow-Credentials"] = "true"
        resp.headers["Access-Control-Allow-Headers"] = "content-type"
        resp.headers["Access-Control-Allow-Methods"] = "PUT,POST,GET,DELETE"
    return resp


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


@app.route("/api/login", methods=["POST"])
def login():
    if USE_DEMO_LOGIN:
        auth_session_with_email(session, "example@example.com")
    else:
        email = request.json["email"]
        send_login_email(email)
    return jsonify(dict(success=True))


@app.route("/api/auth_with_secret")
def auth_with_secret():
    secret = request.args["secret"]
    auth_session_with_secret(session, secret)
    return redirect(BASE_URL)


@app.route("/api/auth_poll")
def auth_poll():
    return jsonify(dict(success=auth_session_if_token_used(session)))


@app.route("/api/context")
def context():
    if not session.get("user_email"):
        return jsonify({})
    user = get_session_user(session)
    return jsonify(dict(user=user.to_json()))


@app.route("/api/trips", methods=["POST"])
def post_trip():
    user = get_session_user(session)
    trip = create_trip(user, name=request.json["name"])
    return jsonify(trip.to_json())


@app.route("/api/trips")
def get_trips():
    user = get_session_user(session)
    trip_id = request.args.get("trip_id")
    if trip_id is not None:
        trip = get_trip(trip_id)
        if not user_can_view_trip(user, trip):
            abort(404)
        return jsonify(trip.to_json_with_items())
    else:
        return jsonify([trip.to_json() for trip in get_trip_for_user(user)])


@app.route("/api/trips", methods=["PUT"])
def put_trip():
    trip_id = request.args.get("trip_id")
    trip = get_trip(trip_id)
    user = get_session_user(session)
    update_trip(trip, user, name=request.json["name"])
    return jsonify(trip.to_json())


@app.route("/api/trips", methods=["DELETE"])
def del_trip():
    trip_id = request.args.get("trip_id")
    trip = get_trip(trip_id)
    user = get_session_user(session)
    delete_trip(trip, user)
    return jsonify(dict(success=True))


@app.route("/api/items", methods=["PUT"])
def put_item():
    item_id = request.args.get("item_id")
    item = get_item(item_id)
    trip = get_trip_for_item(item)
    user = get_session_user(session)
    update_item(item, trip, user, title=request.json["title"], props=request.json["props"], tags=request.json["tags"])
    return jsonify(item.to_json())


@app.route("/api/items", methods=["POST"])
def post_item():
    trip_id = request.args.get("trip_id")
    trip = get_trip(trip_id)
    user = get_session_user(session)
    item = create_item(trip, user, title=request.json["title"], tags=request.json["tags"], props=request.json["props"])
    return jsonify(item.to_json())


@app.route("/api/items", methods=["DELETE"])
def del_item():
    item_id = request.args.get("item_id")
    item = get_item(item_id)
    user = get_session_user(session)
    trip = get_trip_for_item(item)
    delete_item(item, trip, user)
    return jsonify(dict(success=True))


@app.route("/api/invite", methods=["POST"])
def invite():
    user = get_session_user(session)
    trip_id = request.json.get("trip_id")
    trip = get_trip(trip_id)
    email = request.json.get("email")
    viewer_only = request.json.get("viewer_only")
    invite_user_to_trip(email, trip, user, viewer_only=viewer_only)
    return jsonify(dict(success=True))


@app.route("/api/kick", methods=["POST"])
def kick():
    trip_id = request.json.get("trip_id")
    trip = get_trip(trip_id)
    by_user = get_session_user(session)
    email = request.json.get("email")
    remove_user_from_trip(email, trip, by_user)
    return jsonify(dict(success=True))


@app.route("/api/inbound_email", methods=["POST"])
def inbound_email():
    email_data = dict(request.form)
    for inbox in json.loads(email_data["envelope"])["to"]:
        if inbox.endswith("tripbox.sshh.io"):
            add_item_from_inbound_email(inbox, email_data)
    return ""


if __name__ == "__main__":
    app.run(use_reloader=True, port=5000)
