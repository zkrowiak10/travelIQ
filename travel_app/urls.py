from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
import logging
import functools
from travel_app import models, auth
import logging

home = Blueprint('home', __name__, url_prefix='/')

# Home page of website, before delivering app
@home.route('/',  methods=('GET', 'POST'))
def welcome():
    return render_template("welcome.html")

# app roote blueprint. All paths beyond /app require authentication as well.
iq = Blueprint('iq', __name__, url_prefix='/app')

@iq.route('/', methods=('GET','POST'))
@auth.login_required
def iqPage():
    if request.method == 'GET':
        
        return render_template('app/iqApp.html')


@iq.route('/createTrip', methods=('POST','GET'))
@auth.login_required
def create_trip():
    if request.method == 'POST':
        form = request.form
        name, start_date, end_date = form['TName'], form['TStart'], form['TEnd']
        try:
            trip = models.Trip()
            trip.name = name
            trip.start_date = start_date
            trip.end_date = end_date
            pairing = models.UserTripPair(trip=trip, user=g.user,admin = True)
            trip.userPairings.append(pairing)
            models.db.session.add(trip, pairing)
            models.db.session.commit()
        except Exception as e:
            logging.error("Exception in creating trip: {}".format(e))
            flash('something went wrong: {}'.format(e))
            return redirect(url_for('iq.iqPage'))
        flash('Created Trip')   
        return redirect(url_for('iq.iqPage'))
    if request.method == 'GET':
        return render_template('app/createTrip.html')

@iq.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')
    
    if user_id is None:
        g.user = None
    else:
        # g.user = User.query.filter_by(user_id = user_id).first()
        user = models.User.query.filter_by(id=user_id).first()
        g.user = user


        