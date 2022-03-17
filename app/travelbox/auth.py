import secrets

from travelbox.models import get_or_create_user


def gen_token():
    return secrets.token_urlsafe(32)


def auth_user(session, email):
    user = get_or_create_user(email)
    session.permanent = True
    session["user_email"] = email
    print("auth" + email, user)
