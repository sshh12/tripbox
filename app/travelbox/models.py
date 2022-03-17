from flask import abort
from peewee import SqliteDatabase, IntegrityError, Model, CharField, DateTimeField, BooleanField
import datetime

DATABASE = "travelbox.db"

database = SqliteDatabase(DATABASE)


class BaseModel(Model):
    class Meta:
        database = database


class AuthToken(BaseModel):
    auth_token = CharField(unique=True)
    email = CharField()
    authed = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.datetime.now)


class User(BaseModel):
    email = CharField(unique=True)
    username = CharField()
    created_at = DateTimeField(default=datetime.datetime.now)

    def to_json(self):
        return dict(email=self.email, username=self.username)


def get_or_404(model, *exprs):
    try:
        return model.get(*exprs)
    except model.DoesNotExist:
        abort(404)


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
        database.create_tables([AuthToken, User])


if __name__ == "__main__":
    create_tables()
