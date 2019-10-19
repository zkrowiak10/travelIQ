
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, current_app, jsonify, abort, Response
)
import logging
import functools
from travel_app import models, urls
import logging


login_required = urls.login_required

ajax = Blueprint('ajax', __name__, url_prefix='/ajax')


#will need to update these methods to make sure user is authorized to modify resource
@ajax.route('/destinations', methods=('GET', 'POST', 'PATCH', 'DELETE'))
@login_required
def destinations():
    
    #if get, return json of all destinations associated with trip
    if request.method == "GET":
        try:
            dest_list = models.Destination.query.filter_by(trip_id = g.trip.id).all()
        

        except Exception as e:
            logging.error("There was an error in loading json GET request: " + str(e))
            return abort(400)
        
        data = []

        for dest in dest_list:
            dict = {}
            for key in dest.__dict__:
                if key != "_sa_instance_state":
                    dict[key] = dest.__dict__[key]
            data.append(dict)
            
        return jsonify(data)

    #if POST add new destination
    if request.method == "POST":
        try:
            data = request.get_json()
            logging.debug("request data: " + str(data))

            #check if json payload specifies trip, if not, set it to g
            #should throw error if g doesn't have trip attribute
            trip_id = g.trip.id
            logging.debug('setting trip_id: ' + str(trip_id))
            # if data['trip_id'] is not None:
            #     trip_id = data['trip_id']
            #     logging.debug('resetting trip_id: ' + str(trip_id))
            models.Destination(data['name'],trip_id )
            logging.info('created trip: ' + str(data['name']))
        except Exception as e:
            logging.error("There was an error in loading json POST request: " + str(e))
            
            return abort(400)
        return Response("created",201)

        
        

    #if PATCH update resource
    if request.method == "PATCH":
        try:
            data = request.get_json()
            if not data['id']:
                raise Exception("No trip id")
            

            dest = models.Destination.query.filter_by(id = data['id']).first()


            if dest.trip.user != g.user:
                # if not OAUTH():
                return abort(401)
            

            dest.name = data['name']
            models.db.session.add(dest)
            models.db.session.commit()
        except Exception as e:
            logging.error("There was an error in loading json PATCH: " + str(e))
            return abort(400)


#     #if DELETE delete resource
#     if request.method == "DELETE":
#         # check auth
#         try:
#             data = request.get_json()
#             if not data['id']:
#                 raise Exception("No trip id")
            

            dest = models.Destination.query.filter_by(id = data['id']).first()



            

            models.db.session.delete(dest)
            models.db.session.commit()
        except Exception as e:
            logging.error("There was an error in loading json DELETE request: " + str(e))
            return abort(400)
        
        return Response("Deleted", 200)

