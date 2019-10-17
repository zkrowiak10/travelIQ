from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, current_app
)
import logging
import functools
from travel_app import models, urls
import logging

login_required = urls.login_required

ajax = Blueprint('ajax', __name__, url_prefix='/ajax')

@ajax.route('/destinations', methods=('GET', 'POST', 'PATCH', 'DELETE'))
@login_required
def destinations():
    pass
    #if get, return json of all destinations associated with trip

    #if POST add new destination

    #if PATCH update resource

    #if DELETE delete resource