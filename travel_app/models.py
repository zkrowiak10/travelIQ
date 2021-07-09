from flask_sqlalchemy import SQLAlchemy
import click
from flask.cli import with_appcontext
from sqlalchemy.orm import backref
from werkzeug.security import check_password_hash, generate_password_hash
import logging
db = SQLAlchemy()



class Base(db.Model):
    __abstract__ = True

    def update(self, dictionary):
        logging.debug('in update function \n dictionary is: ' + str(dictionary))
        for key, value in dictionary.items():
            if key == "id":
                continue
            setattr(self, key, value)
            
        

class User (Base):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256))
    
    def __str__(self):
        return "Username: " + self.username
    #register new user object
    @classmethod
    def register(self, username, email, password):

        if username == "" or email == "" or password =="":
            logging.info('Not all fields filled out')
            raise AssertionError('All fields must be filled out')
        if User.query.filter_by(username=username).first() != None:
            print("this is the user"+User.query.filter_by(username=username).first())
            raise AssertionError('Username Already Exists')
        user = User(username = username,password = generate_password_hash(password), email = email)
        db.session.add(user)
        db.session.commit()
        

    @classmethod
    def login(self, user_name, password):
        user = User.query.filter_by(username=user_name).first()
        # logging.debug("username is", user)
        # logging.debug("Login params", user_name, password)
        if user == None:
            raise AssertionError("Username does not exist")
        if check_password_hash(user.password, password):
            # logging.INFO('logged in')
            return user
        raise AssertionError("Username or password incorrect")



#Stores container schema for all trip categories. 
#Would like to add validation at some point to validate that it ends after it starts
class Trip(Base):
    id  = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    name = db.Column(db.String(120), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    user = db.relationship('User', backref='trips')
    description = db.Column(db.Text)

    def __init__(self, user, name, start_date, end_date, description):
        if start_date > end_date:
            raise AssertionError('Trip end date must be after start date.')
        if name is "" or start_date is "" or end_date is "":
            raise AssertionError('A Trip must have a name, start and end dates')
        
        #check that user has no trips with that name
        current_trips = Trip.query.filter_by(user= user).all()
        for trip in current_trips:
            if trip.name == name:
                raise AssertionError("Must choose a unique name for your trip")
        self.end_date = end_date
        self.start_date = start_date
        self.name = name
        self.user = user
        self.user_id = user.id
        self.description = description

        db.session.add(self)
        db.session.commit()

    def __str__(self):
        return "Vacation to {} from {} to {}".format(self.name, self.start_date, self.end_date)


class Hotel_Reservation(Base):
    id  = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256))
    link = db.Column(db.String(256))
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    trip = db.relationship('Trip', backref='hotel_reservation')
    user = db.relationship('User', backref='hotel_reservation')
    check_in = db.Column(db.Date, nullable=False)
    check_out = db.Column(db.Date, nullable=False)
    refundable = db.Column(db.Boolean)
    cancellation_date = db.Column(db.Date) 
    destination_id = db.Column(db.Integer, db.ForeignKey('destination.id'))
    destination = db.relationship('Destination', backref='hotel_reservations')
    breakfast_included = db.Column(db.Boolean)
    contact_id = db.Column(db.Integer, db.ForeignKey('contact.id'))
    contact_info = db.relationship('Contact')
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'))
    trip = db.relationship('Trip', backref='hotel_reservations')

#trips should be broken down into destination cities that segment out the stay
class Destination (Base):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(256), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'))
    trip = db.relationship('Trip', backref="destinations")
    notes = db.Column(db.String(256))
    trip_order = db.Column(db.Integer)
    days_there = db.Column(db.Integer)


    def __init__(self, name, trip_id, notes, days_there, trip_order, commit = True):
        
        trip = trip_id
        self.name = name
        self.trip_id = trip
        self.notes = notes
        self.days_there = days_there
        self.trip_order = trip_order

        if commit:
            db.session.add(self)
            db.session.commit()
    
    def __str__(self):
        return "Destination {} on trip {}".format(self.name, self.trip.name)

#a generalized way to store contact info to share common attributes such ass address, phone number, 
# etc between hotels, flights, etc
class Contact(Base):
    id = db.Column(db.Integer, primary_key = True)
    address = db.Column(db.String) #street address
    city = db.Column(db.String(256))
    phone = db.Column(db.String(256))

class Flight(Base):
    id = db.Column(db.Integer, primary_key = True)
    departure_time = db.Column(db.DateTime, nullable=False)
    eta = db.Column(db.DateTime, nullable=False)
    destination = db.Column(db.String(256), nullable=False)
    departing_from = db.Column(db.String(256), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'))
    trip = db.relationship('Trip', backref='flight')


class Car_Rental (Base):
    id = db.Column(db.Integer, primary_key = True)
    pickup = db.Column(db.String(256))
    dropoff = db.Column(db.String(256))
    company = db.Column(db.String(256))
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'))
    trip = db.relationship('Trip', foreign_keys=[trip_id])
    pickup_day = db.Column(db.DateTime)
    dropoff_day = db.Column(db.DateTime)

class Activity(Base):
    id = db.Column(db.Integer, primary_key = True)
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'))
    trip = db.relationship('Trip', backref='activity')
    destination_id = db.Column(db.Integer, db.ForeignKey('destination.id'))
    destination = db.relationship('Destination', backref='activities')
    name = db.Column(db.String(256))
    description = db.Column(db.Text)
    

@click.command('create')
@with_appcontext
def init_db_command():
    db.drop_all()
    db.create_all()
    click.echo("Created database")


if __name__=="__main__":
    print("doing work")
    User.login("test", "password")

