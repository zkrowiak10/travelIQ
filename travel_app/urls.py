from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, current_app
)
import logging
import functools
from travel_app import models
import logging
bp = Blueprint('welcome', __name__, url_prefix='/')

@bp.route('/',  methods=('GET', 'POST'))
def welcome():
    return render_template("welcome.html")

@bp.route('/login', methods=('POST',))
def login():
    try:
        # logging.debug("In login method",request.form )
        username = request.form['Lusername']
        password = request.form['Lpassword']
        user = models.User.login(username, password)
        g.user = user
        session['user_id'] = user.id
        return redirect(url_for('iq.iqPage'))

    except Exception as e:
        logging.debug("there was an exception: " + str(e))
        
        flash("Invalid Username or password") 
        return redirect(url_for('welcome.welcome'))

@bp.route('/register', methods=('POST',))
def register():
    if request.method != "POST":
        flash("can only be POST")
        return redirect(url_for('welcome.welcome'))

    username = request.form['username']
    email = request.form['email']
    password = request.form['password']

    if password != request.form.get('confirmPassword'):
        flash('Make sure passwords match')
        return redirect(url_for('welcome.welcome'))
    try:
        models.User.register(username,email,password)
        flash('Username {} created'.format(username))
        return redirect(url_for('welcome.welcome'))
    except Exception as e:
        flash('something went wrong', str(e))
        logging.error("Exception in creating new user", e)
        return redirect(url_for('welcome.welcome'))
        
@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('welcome.welcome'))



def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            flash('Please log in first')
            return redirect(url_for('welcome.welcome'))

        return view(**kwargs)

    return wrapped_view

iq = Blueprint('iq', __name__, url_prefix='/app')


@iq.route('/', methods=('GET','POST'))
@login_required
def iqPage():
    if request.method == 'GET':
        
        return render_template('app/iqApp.html')

@iq.route('/g', methods=('GET',))
@login_required
def change_g():
    trip_id = request.args['trip']
    session['trip_id'] = trip_id
    return redirect(request.referrer)

@iq.route('/createTrip', methods=('POST','GET'))
@login_required
def create_trip():
    if request.method == 'POST':
        f = request.form
        name, start_date, end_date, description = f['TName'], f['TStart'], f['TEnd'], f['TDescription']
        try:
            trip = models.Trip(name, start_date,end_date, description)
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

    
@iq.route('/addDest', methods=('POST',))
@login_required
def create_dest():
    try:
        name = request.form['DName']

        models.Destination(name, g.trip.id)
    except Exception as e:
        logging.error('Exception creating destination: ' + str(e))
        flash('something went wrong')
    return redirect(request.referrer)

@iq.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')
    
    if user_id is None:
        g.user = None
    else:
        # g.user = User.query.filter_by(user_id = user_id).first()
        user = models.User.query.filter_by(id=user_id).first()
        g.user = user

@iq.before_app_request
def load_current_trip():
    trip_id = session.get('trip_id')

    if trip_id is None:
        g.trip = None
    else:
        g.trip = models.Trip.query.filter_by(id = trip_id).first()
        