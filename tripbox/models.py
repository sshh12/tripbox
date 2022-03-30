import datetime
import os

from peewee import (
    AutoField,
    BooleanField,
    CharField,
    DateTimeField,
    ForeignKeyField,
    Model,
)
from playhouse.postgres_ext import ArrayField, JSONField, PostgresqlExtDatabase

from tripbox.constants import DATABASE_URL

database = PostgresqlExtDatabase(
    database=DATABASE_URL.path[1:],
    user=DATABASE_URL.username,
    password=DATABASE_URL.password,
    host=DATABASE_URL.hostname,
    port=DATABASE_URL.port,
)


class BaseModel(Model):
    class Meta:
        database = database


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
        user_trips = [
            {**user_trip.user.to_json(), **user_trip.to_json()}
            for user_trip in UserTrip.select().join(User).where(UserTrip.trip == self)
        ]
        trip_json = self.to_json()
        trip_json["items"] = trip_items
        trip_json["users"] = user_trips
        return trip_json


class UserTrip(BaseModel):
    user = ForeignKeyField(User)
    trip = ForeignKeyField(Trip)
    owner = BooleanField(default=False)
    viewer_only = BooleanField(default=False)

    def to_json(self):
        return dict(owner=self.owner, viewer_only=self.viewer_only)


class Item(BaseModel):
    item_id = AutoField()
    title = CharField()
    created_at = DateTimeField(default=datetime.datetime.now)
    props = JSONField()
    tags = ArrayField(CharField)

    def to_json(self):
        return dict(item_id=self.item_id, title=self.title, tags=self.tags, props=self.props)


class TripItem(BaseModel):
    trip = ForeignKeyField(Trip)
    item = ForeignKeyField(Item)


class AuthToken(BaseModel):
    auth_token = CharField(unique=True)
    auth_secret = CharField(unique=True)
    email = CharField()
    authed = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.datetime.now)
    join_trip_id = ForeignKeyField(Trip, null=True)
    join_as_viewer = BooleanField(null=True)


MODELS = [AuthToken, User, Trip, Item, UserTrip, TripItem]
