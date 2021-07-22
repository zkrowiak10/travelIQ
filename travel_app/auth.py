import functools
from werkzeug.exceptions import abort
import logging
from travel_app import models
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash



auth = Blueprint('auth', __name__, url_prefix='/auth')

@auth.route('/register', methods=('POST',))
def register():
   
    username = request.form['username']
    email = request.form['email']
    password = request.form['password']

    if password != request.form.get('confirmPassword'):
        flash('Make sure passwords match')
        return redirect(url_for('home.welcome'))
    
    try:
        status = models.User.register(username,email,password)
        if not status:
            flash('Username {} created'.format(username))
        return redirect(url_for('home.welcome'))
        
    except Exception as e:
        flash('something went wrong', str(e))
        logging.error("Exception in creating new user", e)
        return redirect(url_for('home.welcome'))

@auth.route('/login', methods=('POST','GET'))
def login():
    try:
        username = request.form['Lusername']
        password = request.form['Lpassword']
        user = models.User.login(username, password)
        g.user = user
        session['user_id'] = user.id
        return redirect(url_for('iq.iqPage'))

    except Exception as e:
        logging.debug("there was an exception: " + str(e))
        
        flash("Invalid Username or password") 
        return redirect(url_for('home.welcome'))



@auth.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home.welcome'))

def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            flash('Please log in first')
            return redirect(url_for('home.welcome'))

        return view(**kwargs)

    return wrapped_view