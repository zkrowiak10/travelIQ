from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, current_app, jsonify, abort, Response
)
import logging
import functools

from travel_app import models, urls, utils
import logging

login_required = urls.login_required

ajax = Blueprint('ajax', __name__, url_prefix='/ajax')



@ajax.route('/trips',methods=('GET',))
@login_required
def trips():
    trips = models.UserTripPair.getTripsByUser(g.user)
    data = utils.API.serializeList(trips)
    return jsonify(data)

# @ajax.route('/trip/<trip_id>/destinations',methods=('GET',))
# @login_required
# def trip():
#     api = utils.API(models.Trip)
#     return api.api_driver(request)


#will need to update these methods to make sure user is authorized to modify resource
@ajax.route('/trip/<trip_id>/destinations', methods=('GET',))
@login_required
def destinations(trip_id):
    
    #if get, return json of all destinations associated with trip
    if request.method == "GET":
        try:
            trips = models.UserTripPair.getTripsByUser(g.user)
            
            currentTrip = [trip for trip in trips if trip.id == int(trip_id)]
            logging.debug(trip_id)
            data =  utils.API.serializeList(currentTrip[0].destinations)
            return jsonify(data)
        
        except Exception as e:
            logging.error("There was an error in loading json GET request: " + str(e))
            return abort(400)
        
@ajax.route('/trip/<trip_id>/destination',methods=('POST', 'PATCH', 'DELETE'))
@login_required
def destination(trip_id):

    trips = models.UserTripPair.getTripsByUser(g.user)
            
    currentTrip = [trip for trip in trips if trip.id == int(trip_id)][0]
    #if POST add new destination
    if request.method == "POST":
        try:
            data = request.get_json()
            logging.debug("request data: " + str(data))

            
            logging.debug('setting trip_id: ' + str(trip_id))
            # if data['trip_id'] is not None:
            #     trip_id = data['trip_id']
            #     logging.debug('resetting trip_id: ' + str(trip_id))
            
            # need to improve constructor to take all fields
            dest = models.Destination(**data)
            currentTrip.destinations.append(dest)
            models.db.session.commit()
            data = {"id": dest.id}
            logging.info('created trip: ' + str(dest.name)+ "with id: " + str(data['id']))
        except Exception as e:
            logging.error("There was an error in loading json POST request: " + str(e))
            
            return abort(400)
        return jsonify(data), 201
        
        

    #if PATCH update resource
    if request.method == "PATCH":
        try:
            data = request.get_json()
            
            logging.debug("patching data from dict: " + str(data))
            if not data['id']:
                raise Exception("No trip id")
            
            dest = models.Destination.query.filter_by(id = data['id']).first()

            if dest.trip.user != g.user:
                # if not OAUTH():
                return abort(401)
            
            dest.update(data)
            logging.debug("this is the edited notes" + str(dest.notes))
            
            # dest.name = data['name']
            # dest.notes = data['notes']
            # dest.trip_order = data['trip_order']
            
            models.db.session.add(dest)
            models.db.session.commit()
            return Response("updated",200)
        except Exception as e:
            logging.error("There was an error in loading json PATCH: " + str(e))
            return abort(400)
        

    #if DELETE delete resource
    if request.method == "DELETE":
        # check auth
        try:
            data = request.get_json()
            if not data['id']:
                raise Exception("No trip id")
            
            dest = models.Destination.query.filter_by(id = data['id']).first()

            if dest.trip.user != g.user:
                # if not OAUTH():
                return abort(401)
            
            models.db.session.delete(dest)
            models.db.session.commit()
        except Exception as e:
            logging.error("There was an error in loading json DELETE request: " + str(e))
            return abort(400)
        
        return Response("Deleted", 200)


@ajax.route('/hotels', methods=('GET', 'POST', 'PATCH', 'DELETE'))
@login_required
def hotels():
    api = utils.API(models.Hotel_Reservation)
    return api.api_driver(request)

@ajax.route('/flights', methods=('GET', 'POST', 'PATCH', 'DELETE'))
@login_required
def flights():
    api = utils.API(models.Flight)
    return api.api_driver(request)

@ajax.route('/rentals', methods=('GET', 'POST', 'PATCH', 'DELETE'))
@login_required
def rentals():
    api = utils.API(models.Car_Rental)
    return api.api_driver(request)