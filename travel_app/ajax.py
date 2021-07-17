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
        
@ajax.route('/trip/<trip_id>/destination',methods=('POST', ))
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

@ajax.route('/trip/<trip_id>/destination/<dest_id>',methods=('PATCH', 'DELETE'))
@login_required
def destinationUpdates(trip_id, dest_id):

    trips = models.UserTripPair.getTripsByUser(g.user)
            
    currentTrip = [trip for trip in trips if trip.id == int(trip_id)][0]
    
    data = request.get_json()
            
    logging.debug("patching data from dict: " + str(data))
    if not data['id']:
        raise Exception("No trip id")
    
    dest = [dest for dest in currentTrip.destinations if dest.id == int(dest_id)][0]
    if g.user not in models.UserTripPair.getUsersByTrip(currentTrip):
        # if not OAUTH():
        return abort(401)

    #if PATCH update resource
    if request.method == "PATCH":
        try:
            
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
            models.db.session.delete(dest)
            models.db.session.commit()
        except Exception as e:
            logging.error("There was an error in loading json DELETE request: " + str(e))
            return abort(400)
        
        return Response("Deleted", 200)

@ajax.route('/trip/<trip_id>/destination/<dest_id>/hotels', methods=('GET',))
@login_required
def getHotels(trip_id,dest_id):

    trips = models.UserTripPair.getTripsByUser(g.user)
    currentTrip = [trip for trip in trips if trip.id == int(trip_id)][0]
    dest = [dest for dest in currentTrip.destinations if dest.id == int(dest_id)][0]

    logging.debug(models.UserTripPair.getUsersByTrip(currentTrip)[0])
    if g.user not in models.UserTripPair.getUsersByTrip(currentTrip):
        # if not OAUTH():
        return abort(401)
    data = dest.hotels
    serial = utils.API.serializeList(data)

    return jsonify(serial)

@ajax.route('/trip/<trip_id>/destination/<dest_id>/hotel', methods=('POST',))
@login_required
def addHotel(trip_id,dest_id):
    trips = models.UserTripPair.getTripsByUser(g.user)
    currentTrip = [trip for trip in trips if trip.id == int(trip_id)][0]
    dest = [dest for dest in currentTrip.destinations if dest.id == int(dest_id)][0]
    if g.user not in models.UserTripPair.getUsersByTrip(currentTrip):
        # if not OAUTH():
        return abort(401)
    data = request.get_json()
    logging.debug(data)
    contact = models.Contact(**data['contact_info'])
    data = [item for item in data if item != "contact_info"]
    hotel = models.Hotel_Reservation(**data)
    hotel.contact_info = contact
    dest.hotels.append(hotel)
    models.db.session.commit()
    data = {"id": hotel.id}
    logging.debug("response" + str(data))
    return  jsonify(data), 201

@ajax.route('/trip/<trip_id>/destination/<dest_id>/hotel/<hotel_id>', methods=( 'PATCH', 'DELETE'))
@login_required
def changeHotel(trip_id, dest_id,hotel_id ):
    trips = models.UserTripPair.getTripsByUser(g.user)
    currentTrip = [trip for trip in trips if trip.id == int(trip_id)][0]
    dest = [dest for dest in currentTrip.destinations if dest.id == int(dest_id)][0]
    hotel = [hotel for hotel in dest.hotels if hotel.id == int(hotel_id)][0]
    if g.user not in models.UserTripPair.getUsersByTrip(currentTrip):
        # if not OAUTH():
        return abort(401)
    if request.method == "PATCH":
        hotel.update(request.get_json())
        models.db.session.commit()
        return Response("updated",200)
        
    if request.method =="DELETE":
        models.db.session.delete(hotel)
        models.db.session.commit()
    return Response("Deleted", 200)


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