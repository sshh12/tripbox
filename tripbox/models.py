from flask import abort
import secrets
import re
from peewee import (
    SqliteDatabase,
    IntegrityError,
    Model,
    CharField,
    DateTimeField,
    BooleanField,
    ForeignKeyField,
    AutoField,
)
import datetime

DATABASE = "tripbox.db"

database = SqliteDatabase(DATABASE)


class BaseModel(Model):
    class Meta:
        database = database


class AuthToken(BaseModel):
    auth_token = CharField(unique=True)
    auth_secret = CharField(unique=True)
    email = CharField()
    authed = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.datetime.now)


class User(BaseModel):
    email = CharField(unique=True)
    username = CharField()
    created_at = DateTimeField(default=datetime.datetime.now)

    def to_json(self):
        return dict(email=self.email, username=self.username)


class Trip(BaseModel):
    trip_id = AutoField()
    name = CharField()
    inbox_email = CharField()
    created_at = DateTimeField(default=datetime.datetime.now)

    def to_json(self):
        return dict(trip_id=self.trip_id, name=self.name, inbox_email=self.inbox_email)

    def to_json_with_items(self):
        trip_items = [
            trip_item.item.to_json() for trip_item in TripItem.select().join(Item).where(TripItem.trip == self)
        ]
        trip_json = self.to_json()
        trip_json["items"] = trip_items
        return trip_json


class UserTrip(BaseModel):
    user = ForeignKeyField(User)
    trip = ForeignKeyField(Trip)
    owner = BooleanField(default=False)
    viewer_only = BooleanField(default=False)


class Item(BaseModel):
    item_id = AutoField()
    title = CharField()
    created_at = DateTimeField(default=datetime.datetime.now)

    def to_json(self):
        return dict(title=self.title)


class TripItem(BaseModel):
    trip = ForeignKeyField(Trip)
    item = ForeignKeyField(Item)


def get_trip_inbox(trip_name):
    rand = secrets.token_urlsafe(6).replace("-", "").replace("_", "")
    clean_name = re.sub("\W", "", trip_name)
    if clean_name == "":
        clean_name = "trip"
    return clean_name + "+" + rand + "@tripbox.sshh.io"


def get_or_404(model, *exprs):
    try:
        return model.get(*exprs)
    except model.DoesNotExist:
        abort(404)


def create_trip(user, name):
    trip_inbox = get_trip_inbox(name)
    trip = Trip.create(name=name, inbox_email=trip_inbox)
    UserTrip.create(user=user, trip=trip, owner=True)
    return trip


def create_item(trip, title):
    item = Item.create(title=title)
    TripItem.create(trip=trip, item=item)
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
        database.create_tables([AuthToken, User, Trip, Item, UserTrip, TripItem])
    user = get_or_create_user("example@example.com")
    trip = create_trip(user, "Test Trip")


if __name__ == "__main__":
    create_tables()
