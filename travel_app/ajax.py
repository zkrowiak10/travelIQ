from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, current_app, jsonify, abort, Response
)
import logging
from travel_app import models, urls, utils, auth
import logging

login_required = auth.login_required

# API Routes.
ajax = Blueprint('ajax', __name__, url_prefix='/ajax')

# TODO: Lots of repeated procedures. Create generalized utility methods using the API class before
# adding additionaly routes

@ajax.route('/trip/<trip_id>', methods=('PATCH','DELETE'))
@login_required
def change_trips(trip_id):
    data = request.get_json()
    trip = models.Trip.query.filter_by(id=trip_id).first()
    if not trip:
        abort(404)
    if request.method == 'PATCH':
        try:            
            trip.update(data)
            models.db.session.add(trip)
            models.db.session.commit()
            return Response('updated', 200) 
        except Exception as e:
            logging.error("Exception in editing trip: {}".format(e))
            abort(400)
        
    if request.method == 'DELETE':
        try:
            models.db.session.delete(trip) #TODO: Cascade delete implementation
            models.db.session.commit()
            return Response('deleted', 200)
        except Exception as e:
            logging.error("Exception in deleting trip: {}".format(e))
        
@ajax.route('/trips',methods=('GET',))
@login_required
def trips():
    if request.method == "GET":
        trips = models.UserTripPair.getTripsByUser(g.user)
        data = utils.API.serializeList(trips)
        return jsonify(data)

@ajax.route('/trip', methods=('POST',))
@login_required
def add_trip():
    data = request.get_json()

    # TODO: Line below is repeated often: sanitize data before instantiating ORM record
    data = {key: data[key] for key in data if key in models.Trip.__dict__ }
    trip = models.Trip(**data)
    try:
        pairing = models.UserTripPair(trip=trip, user=g.user,admin = True)
        trip.userPairings.append(pairing)
        models.db.session.add(trip, pairing)
        models.db.session.commit()
        retValue = {'id': trip.id}
        return jsonify(retValue), 201
    except Exception as e:
        logging.error("Exception in creating trip: {}".format(e))
        return Response('Something went wrong',500)      

#will need to update these methods to make sure user is authorized to modify resource
@ajax.route('/trip/<trip_id>/destinations', methods=('GET',))
@login_required
def destinations(trip_id):
    
    #if get, return json of all destinations associated with trip
    if request.method == "GET":
        try:
            trips = models.UserTripPair.getTripsByUser(g.user)
            
            currentTrip = models.Trip.query.filter_by(id=trip_id).first()
            logging.debug(trip_id)
            data =  utils.API.serializeList(currentTrip.destinations)
            return jsonify(data)
        
        except Exception as e:
            logging.error("There was an error in loading json GET request: " + str(e))
            return abort(400)
        
@ajax.route('/trip/<trip_id>/destination',methods=('POST', ))
@login_required
def destination(trip_id):
            
    currentTrip = models.Trip.query.filter_by(id=trip_id).first()
    #TODO: Validate user is authorized for this operation.

    #if POST add new destination
    if request.method == "POST":
        try:
            data = request.get_json()
            data = {key:data[key] for key in data if key in models.Destination.__dict__}
            logging.debug("request data: " + str(data))
            logging.debug('setting trip_id: ' + str(trip_id))
            
            # need to improve constructor to take all fields
            dest = models.Destination(**data)
            currentTrip.destinations.append(dest)
            models.db.session.commit()
            data = {"id": dest.id}
            logging.debug('created trip: ' + str(dest.name)+ "with id: " + str(data['id']))
            return jsonify(data), 201

        except Exception as e:
            logging.error("There was an error in loading json POST request: " + str(e))
            return abort(500) #TODO: improve status codes by using better except blocks
        
    #if PATCH update resource
    if request.method == "PATCH":
        try:
            data = request.get_json()
            
            logging.debug("patching data from dict: " + str(data))
            if not data['id']:
                abort(400)
            
            dest = models.Destination.query.filter_by(id = data['id']).first()

            if dest.trip.user != g.user:
                # if not OAUTH():
                return abort(401)
            
            dest.update(data)

            models.db.session.add(dest)
            models.db.session.commit()

            return Response("updated",200)
        except Exception as e:
            logging.error("There was an error in loading json PATCH: " + str(e))
            return abort(400)
        
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

    currentTrip = models.Trip.query.filter_by(id=trip_id).first()
    
    data = request.get_json()
            
    logging.debug("patching data from dict: " + str(data))
    if not data['id']:
        abort(400)
    
    dest = [dest for dest in currentTrip.destinations if dest.id == int(dest_id)][0]
    if not dest:
        abort(404)

    if g.user not in models.UserTripPair.getUsersByTrip(currentTrip):
        # if not OAUTH():
        return abort(401)

    #if PATCH update resource
    if request.method == "PATCH":
        try:
            dest.update(data)
            models.db.session.add(dest)
            models.db.session.commit()
            return Response("updated",200)
        except Exception as e:
            logging.error("There was an error in loading json PATCH: " + str(e))
            return abort(400)
        

    #if DELETE delete resource
    if request.method == "DELETE":
        try:            
            models.db.session.delete(dest)
            models.db.session.commit()
            return Response("Deleted", 200)
        except Exception as e:
            logging.error("There was an error in loading json DELETE request: " + str(e))
            return abort(400)
        
        

@ajax.route('/trip/<trip_id>/destination/<dest_id>/hotels', methods=('GET',))
@login_required
def getHotels(trip_id,dest_id):

    #TODO: add try/except blocks
    currentTrip = models.Trip.query.filter_by(id=trip_id).first()
    dest = [dest for dest in currentTrip.destinations if dest.id == int(dest_id)][0]
    if not dest:
        abort(404)

    if g.user not in models.UserTripPair.getUsersByTrip(currentTrip):
        # if not OAUTH():
        return abort(401)
    if dest not in currentTrip.destinations:
        return abort(401)

    data = dest.hotels
    serial = utils.API.serializeList(data)

    return jsonify(serial)

@ajax.route('/trip/<trip_id>/destination/<dest_id>/hotel', methods=('POST',))
@login_required
def addHotel(trip_id,dest_id):
    currentTrip = models.Trip.query.filter_by(id=trip_id).first()
    dest = [dest for dest in currentTrip.destinations if dest.id == int(dest_id)][0]
    if not dest:
        abort(404)

    if g.user not in models.UserTripPair.getUsersByTrip(currentTrip):
        # if not OAUTH():
        return abort(401)
    if dest not in currentTrip.destinations:
        return abort(401)
    
    data = request.get_json()
    data = {key: data[key] for key in data if key in  models.Hotel_Reservation.__dict__}
    hotel = models.Hotel_Reservation(**data)
    dest.hotels.append(hotel)
    models.db.session.commit()
    data = {"id": hotel.id}
    return  jsonify(data), 201

@ajax.route('/trip/<trip_id>/destination/<dest_id>/hotel/<hotel_id>', methods=( 'PATCH', 'DELETE'))
@login_required
def changeHotel(trip_id, dest_id,hotel_id ):
    currentTrip = models.Trip.query.filter_by(id=trip_id).first()
    dest = [dest for dest in currentTrip.destinations if dest.id == int(dest_id)][0]
    if not dest:
        abort(404)
    hotel = [hotel for hotel in dest.hotels if hotel.id == int(hotel_id)][0]
    if not hotel:
        abort(404)
    if not dest:
        abort(404)

    if g.user not in models.UserTripPair.getUsersByTrip(currentTrip):
        # if not OAUTH():
        return abort(401)
    if dest not in currentTrip.destinations:
        return abort(401)

    if request.method == "PATCH":
        hotel.update(request.get_json())
        models.db.session.commit()
        return Response("updated",200)
        
    if request.method =="DELETE":
        models.db.session.delete(hotel)
        models.db.session.commit()
    return Response("Deleted", 200)

@ajax.route('/trip/<trip_id>/destination/<dest_id>/restaurants', methods=('GET',))
@login_required
def getRestaurants(trip_id,dest_id):

    currentTrip = models.Trip.query.filter_by(id=trip_id).first()
    dest = [dest for dest in currentTrip.destinations if dest.id == int(dest_id)][0]
    if not dest:
        abort(404)

    if g.user not in models.UserTripPair.getUsersByTrip(currentTrip):
        # if not OAUTH():
        return abort(401)
    data = dest.restaurants
    serial = utils.API.serializeList(data)

    return jsonify(serial)

@ajax.route('/trip/<trip_id>/destination/<dest_id>/restaurant', methods=('POST',))
@login_required
def addRestaurant(trip_id,dest_id):
    currentTrip = models.Trip.query.filter_by(id=trip_id).first()
    dest = [dest for dest in currentTrip.destinations if dest.id == int(dest_id)][0]
    if not dest:
        abort(404)

    if g.user not in models.UserTripPair.getUsersByTrip(currentTrip):
        # if not OAUTH():
        return abort(401)

    data = request.get_json()
    data = {key: data[key] for key in data if key in  models.Restaurant.__dict__}

    restaurant = models.Restaurant(**data)
    dest.restaurants.append(restaurant)
    models.db.session.commit()
    data = {"id": restaurant.id}
    return  jsonify(data), 201

@ajax.route('/trip/<trip_id>/destination/<dest_id>/restaurant/<restaurant_id>', methods=( 'PATCH', 'DELETE'))
@login_required
def changerRstaurant(trip_id, dest_id,restaurant_id):
    currentTrip = models.Trip.query.filter_by(id=trip_id).first()
    dest = [dest for dest in currentTrip.destinations if dest.id == int(dest_id)][0]
    if not dest:
        abort(404)
    restaurant = [restaurant for restaurant in dest.restaurants if restaurant.id == int(restaurant_id)][0]
    if not restaurant:
        abort(404)

    if g.user not in models.UserTripPair.getUsersByTrip(currentTrip):
        # if not OAUTH():
        return abort(401)
    if request.method == "PATCH":
        restaurant.update(request.get_json())
        models.db.session.commit()
        return Response("updated",200)
        
    if request.method =="DELETE":
        models.db.session.delete(restaurant)
        models.db.session.commit()
    return Response("Deleted", 200)

# The following routes are not currently in use and will need to be updated.
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

