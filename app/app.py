import os
import datetime
from flask import Flask, send_from_directory, g, session, jsonify, request, abort, redirect

from travelbox.models import database, get_or_404, AuthToken, User
from travelbox import emails, auth

BASE_URL = os.environ.get("BASE_URL", "http://localhost:5000")


app = Flask(__name__, static_folder="../build")
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
    token = auth.gen_token()
    session["auth_token"] = token
    email = request.json["email"]
    AuthToken.create(auth_token=token, email=email)
    emails.send_email(
        email,
        "Login to TripBox",
        'Click this link to login: <a href="{}">Login to TripBox</a>'.format(
            BASE_URL + "/api/auth_with_token?token=" + token
        ),
    )
    return jsonify(dict(success=True))


@app.route("/api/auth_with_token")
def auth_with_token():
    token = request.args["token"]
    auth_token = get_or_404(AuthToken, AuthToken.auth_token == token)
    auth_token.authed = True
    auth_token.save()
    auth.auth_user(session, auth_token.email)
    return redirect(BASE_URL)


@app.route("/api/auth_poll")
def auth_poll():
    if session.get("user_email"):
        return jsonify(dict(success=True))
    auth_token = get_or_404(AuthToken, AuthToken.auth_token == session["auth_token"])
    if auth_token.authed:
        session.pop("auth_token")
        auth.auth_user(session, auth_token.email)
        return jsonify(dict(success=True))
    return jsonify(dict(success=False))


@app.route("/api/context")
def context():
    print(list(session.items()))
    if not session.get("user_email"):
        return jsonify({})
    user = get_current_user()
    return jsonify(dict(user=user.to_json()))


if __name__ == "__main__":
    app.run(use_reloader=True, port=5000)
