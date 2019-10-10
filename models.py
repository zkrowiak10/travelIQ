from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Sting(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    trips = db.Relationship('Trip', backref='user')


#Stores container schema for all trip categories. 
#Would like to add validation at some point to validate that it ends after it starts
class Trip(db.Model):
    id  = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    name = db.Column(db.String(120), unique=True, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    user = db.Relationship('User')

    def __init__(self, user, name, start_date, end_date):
        if start_date > end_date:
            raise Exception('Trip end date must be after start date.')
        self.end_date = end_date
        self.start_date = start_date
        self.name = name
        self.user = user
        self.user_id = user.id

    def __str__(self):
        return "Vacation to {} from {} to {}".format(self.name, self.start_date, self.end_date)


class Hotel_Reservation(db.Model):
    id  = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    trip = db.Relationship('Trip', backref='hotel_reservation')
    user = db.Relationship('User', backref='hotel_reservation')
