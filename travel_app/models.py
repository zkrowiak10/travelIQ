from travel_app.ajax import destinations
from flask_sqlalchemy import SQLAlchemy
import click
from flask.cli import with_appcontext
from sqlalchemy.orm import backref
from werkzeug.security import check_password_hash, generate_password_hash
import logging
from flask import (
    flash
)
db = SQLAlchemy()


class Base(db.Model):
    __abstract__ = True

    # generic update method for interpreting updates with dictionary
    def update(self, dictionary):
        logging.debug(
            'in update function \n dictionary is: ' + str(dictionary))
        # filter out any keys accidentally sent over, and filter out ID, which cannot change when updating.
        dictionary = {key: dictionary[key]
                      for key in dictionary if key != "id" and key in self.__dict__}
        for key, value in dictionary.items():
            setattr(self, key, value)

    # TODO create abstract method for __init__


class User (Base):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256))

    def __str__(self):
        return "Username: " + self.username

    # register new user object
    @classmethod
    def register(self, username: str, email: str, password: str) -> bool:

        if username == "" or email == "" or password == "":
            logging.info('Not all fields filled out')
            raise AssertionError('All fields must be filled out')
        existingUser = User.query.filter_by(username=username).first()
        if existingUser != None:
            logging.debug("this is the user" + str(existingUser))
            flash('User already exists')
            return False
        user = User(username=username, password=generate_password_hash(
            password), email=email)
        db.session.add(user)
        db.session.commit()
        return True

    @classmethod
    def login(self, user_name, password):
        user = User.query.filter_by(username=user_name).first()

        if user == None:
            raise AssertionError("Username does not exist")

        if check_password_hash(user.password, password):
            # logging.INFO('logged in')
            return user
        raise AssertionError("Username or password incorrect")


# Stores container schema for all trip categories.
# Would like to add validation at some point to validate that it ends after it starts
class Trip(Base):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text)


class Hotel_Reservation(Base):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256))
    link = db.Column(db.String(256))

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref='hotel_reservation')

    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'))
    trip = db.relationship('Trip', backref='hotel_reservation')

    destination_id = db.Column(db.Integer, db.ForeignKey('destination.id'))
    destination = db.relationship('Destination', backref='hotels')

    check_in = db.Column(db.Date, nullable=False)
    check_out = db.Column(db.Date, nullable=False)
    refundable = db.Column(db.Boolean)
    cancellation_date = db.Column(db.Date)
    breakfast_included = db.Column(db.Boolean)
    phone = db.Column(db.String)
    address = db.Column(db.String)
    city = db.Column(db.String)
    rate = db.Column(db.Float)

# For future versions that enable trip sharing, create a middle table to store which users have which
# kind of access to which trips.


class UserTripPair(Base):
    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'))
    trip = db.relationship('Trip', backref='userPairings')

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref='tripPairings')

    admin = db.Column(db.Boolean)

    @staticmethod
    def getTripsByUser(user):
        trips = [pairing.trip for pairing in user.tripPairings]
        return trips

    @staticmethod
    def getUsersByTrip(trip):
        users = [pairing.user for pairing in trip.userPairings]
        return users

# trips should be broken down into destination cities that segment out the stay


class Destination (Base):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'))
    trip = db.relationship('Trip', backref="destinations")
    notes = db.Column(db.String(256))
    days_there = db.Column(db.Integer)

    # TODO: no two destinations in the same trip should be able to have the same value for this field
    trip_order = db.Column(db.Integer)


class Restaurant (Base):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256))
    address = db.Column(db.String(256))
    city = db.Column(db.String(256))
    reservation = db.Column(db.DateTime())
    link = db.Column(db.String())
    # TODO: refactor to us Enum eventually
    mealType = db.Column(db.String(256))
    # Day should be < self.destination.days_there
    day = db.Column(db.Integer())

    destination_id = db.Column(db.Integer, db.ForeignKey('destination.id'))
    destination = db.relationship('Destination', backref='restaurants')

# Eventual addition of transportation tracking tools will use these tables


class Flight(Base):
    id = db.Column(db.Integer, primary_key=True)
    departure_time = db.Column(db.DateTime, nullable=False)
    eta = db.Column(db.DateTime, nullable=False)
    destination = db.Column(db.String(256), nullable=False)
    departing_from = db.Column(db.String(256), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'))
    trip = db.relationship('Trip', backref='flight')


class Car_Rental (Base):
    id = db.Column(db.Integer, primary_key=True)
    pickup = db.Column(db.String(256))
    dropoff = db.Column(db.String(256))
    company = db.Column(db.String(256))
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'))
    trip = db.relationship('Trip', foreign_keys=[trip_id])
    pickup_day = db.Column(db.DateTime)
    dropoff_day = db.Column(db.DateTime)


class Activity(Base):
    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'))
    trip = db.relationship('Trip', backref='activity')
    destination_id = db.Column(db.Integer, db.ForeignKey('destination.id'))
    destination = db.relationship('Destination', backref='activities')
    name = db.Column(db.String(256))
    description = db.Column(db.Text)

# CLI utility to create all tables


@click.command('create')
@with_appcontext
def init_db_command():
    db.create_all()
    click.echo("Created database")
