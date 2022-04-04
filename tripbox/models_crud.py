import json
import re
import secrets

from flask import abort
from peewee import IntegrityError

from tripbox.constants import BASE_URL, INBOX_DOMAIN
from tripbox.emails import send_email
from tripbox.models import (
    MODELS,
    AuthToken,
    Item,
    Trip,
    TripItem,
    User,
    UserTrip,
    database,
)


def gen_token():
    return secrets.token_urlsafe(32)


def auth_session_with_email(session, email):
    user = get_or_create_user(email)
    session.permanent = True
    session["user_email"] = email
    return user


def auth_session_with_secret(session, secret):
    auth_token = get_or_404(AuthToken, AuthToken.auth_secret == secret)
    if not auth_token.authed:
        auth_token.authed = True
        auth_token.save()
    user = auth_session_with_email(session, auth_token.email)
    if auth_token.join_trip_id:
        add_user_to_trip(user, auth_token.join_trip_id, viewer_only=auth_token.join_as_viewer)


def auth_session_if_token_used(session):
    if session.get("user_email"):
        return True
    auth_token = get_or_404(AuthToken, AuthToken.auth_token == session["auth_token"])
    if auth_token.authed:
        session.pop("auth_token")
        auth_session_with_email(session, auth_token.email)
        return True
    return False


def get_session_user(session):
    if "user_email" in session:
        return User.get(User.email == session["user_email"])
    raise ValueError()


def user_can_view_trip(user, trip):
    return UserTrip.select().where(UserTrip.user == user, UserTrip.trip == trip).exists()


def user_can_edit_trip(user, trip):
    return UserTrip.select().where(UserTrip.user == user, UserTrip.trip == trip, UserTrip.viewer_only == False).exists()


def get_or_404(model, *exprs):
    try:
        return model.get(*exprs)
    except model.DoesNotExist:
        abort(404)


def get_item(item_id):
    return get_or_404(Item, Item.item_id == item_id)


def get_trip(trip_id):
    return get_or_404(Trip, Trip.trip_id == trip_id)


def get_trip_for_user(user):
    return [trip for trip in Trip.select().join(UserTrip).where(UserTrip.user == user).order_by(Trip.trip_id.desc())]


def create_trip(by_user, name):
    trip_inbox = get_trip_inbox(name)
    trip = Trip.create(name=name, inbox_email=trip_inbox)
    add_user_to_trip(user=by_user, trip=trip, owner=True)
    return trip


def update_trip(trip, by_user, *, name):
    if not user_can_edit_trip(by_user, trip):
        abort(401)
    trip.name = name
    trip.save()
    return trip


def delete_trip(trip, by_user):
    if not user_can_edit_trip(by_user, trip):
        abort(401)
    with database.atomic():
        trip_items = Item.select().join(TripItem).where(TripItem.trip == trip)
        TripItem.delete().where(TripItem.trip == trip).execute()
        Item.delete().where(Item.item_id.in_(trip_items)).execute()
        UserTrip.delete().where(UserTrip.trip == trip).execute()
        AuthToken.delete().where(AuthToken.join_trip_id == trip).execute()
        trip.delete_instance()


def add_user_to_trip(user, trip, **opts):
    if UserTrip.select().where(UserTrip.user == user, UserTrip.trip == trip).exists():
        return
    UserTrip.create(user=user, trip=trip, **opts)


def remove_user_from_trip(user_email, trip, by_user):
    if not user_can_edit_trip(by_user, trip):
        abort(401)
    user_trip = (
        UserTrip.select()
        .join(User)
        .where(UserTrip.trip == trip.trip_id, User.email == user_email, UserTrip.owner == False)
        .get()
    )
    user_trip.delete_instance()


def invite_user_to_trip(user_email, trip, by_user, *, viewer_only):
    send_invite_email(by_user.email, user_email, trip, viewer_only)


def get_trip_for_item(item):
    return TripItem.select().where(TripItem.item == item).get().trip


def create_item(trip, by_user, *, title, tags=[], props={}):
    if by_user is not None and not user_can_edit_trip(by_user, trip):
        abort(401)
    item = Item.create(title=title, tags=tags, props=props)
    TripItem.create(trip=trip, item=item)
    return item


def delete_item(item, trip, by_user):
    if not user_can_edit_trip(by_user, trip):
        abort(401)
    with database.atomic():
        TripItem.delete().where(TripItem.item == item).execute()
        item.delete_instance()


def update_item(item, trip, by_user, *, title, props, tags):
    if not user_can_edit_trip(by_user, trip):
        abort(401)
    item.title = title
    item.props = props
    item.tags = tags
    item.save()
    return item


def get_or_create_user(email):
    try:
        with database.atomic():
            user = User.create(email=email, username=email.split("@", 1)[0])
    except IntegrityError:
        try:
            user = User.get(User.email == email)
        except User.DoesNotExist:
            abort(400)
    return user


def create_tables():
    with database:
        database.drop_tables(MODELS)
        database.create_tables(MODELS)
    user = get_or_create_user("example@example.com")
    trip = create_trip(user, "Test Trip")
    items = [
        create_item(trip, None, title="Confirmation for The Lincoln", tags=["hotel"]),
        create_item(trip, None, title="Airline Ticket Confirmation", tags=["flight"]),
    ]


def get_trip_inbox(trip_name):
    rand = secrets.token_urlsafe(6).replace("-", "").replace("_", "")
    clean_name = re.sub("\W", "", trip_name)
    if clean_name == "":
        clean_name = "trip"
    return clean_name + "+" + rand + "@" + INBOX_DOMAIN


def send_login_email(session, email):
    token = gen_token()
    secret = gen_token()
    session["auth_token"] = token
    AuthToken.create(auth_token=token, auth_secret=secret, email=email)
    send_email(
        email,
        "Login to TripBox",
        'Use this link to login: <a href="{}">Login to TripBox</a>'.format(
            BASE_URL + "/api/auth_with_secret?secret=" + secret
        ),
    )


def send_invite_email(from_email, email, trip, viewer_only):
    token = gen_token()
    secret = gen_token()
    AuthToken.create(
        auth_token=token, auth_secret=secret, email=email, join_trip_id=trip.trip_id, join_as_viewer=viewer_only
    )
    send_email(
        email,
        "Login to TripBox to join " + trip.name,
        'You were invited by {} to join TripBox. Use this link to login: <a href="{}">Login to TripBox</a>'.format(
            from_email, BASE_URL + "/api/auth_with_secret?secret=" + secret
        ),
    )


def add_item_from_inbound_email(inbox_email, email_data):
    trip = get_or_404(Trip, Trip.inbox_email == inbox_email)
    title = email_data["subject"].replace("Fwd: ", "")
    from_email = json.loads(email_data["envelope"])["from"]
    create_item(trip, by_user=None, title=title, tags=["by:" + from_email], props={"email": email_data})


if __name__ == "__main__":
    create_tables()
