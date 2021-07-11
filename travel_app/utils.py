from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, current_app, jsonify, abort, Response
)
import logging
import functools
from travel_app import models, urls
import logging


class API ():
    
    def __init__(self, className):
        self.className = className
    
    @staticmethod
    def serializeList(obj_list):
        data = []
        for obj in obj_list:
            logging.debug("this is the data __dict" + str(obj.__dict__))
            dict = {}
            for key, value in obj.__dict__.items():
                
                if key != "_sa_instance_state":
                    dict[key] = value
            data.append(dict)
        
        return data
    
    def serializeItem(obj_list):
        dict = {}
        for obj in obj_list:
            logging.debug("this is the data __dict" + str(obj.__dict__))
            
            for key, value in obj.__dict__.items():
                
                if key != "_sa_instance_state":
                    dict[key] = value
            
        
        return dict
        
    def api_driver(self, request):
        if request.method == "GET":
            logging.debug("In api_driver")
            try:
                obj_list = self.className.query.filter_by().all()
            
            except Exception as e:
                logging.error("There was an error in loading json GET request: " + str(e))
                return abort(400)
            
                
            return jsonify(data)

        #if POST add new destination
        if request.method == "POST":
            try:
                data = request.get_json()
                logging.debug("request data: " + str(data))
                for key, value in data.items():
                    if value =="True":
                        data[key] = True
                    if value == 'False':
                        data[key] = False
                #check if json payload specifies trip, if not, set it to g
                #should throw error if g doesn't have trip attribute
                trip_id = g.trip.id
                data['trip_id'] = g.trip.id
                logging.debug('setting trip_id: ' + str(trip_id))
                # if data['trip_id'] is not None:
                #     trip_id = data['trip_id']
                #     logging.debug('resetting trip_id: ' + str(trip_id))
                
                # need to improve constructor to take all fields
                obj = self.className(**data)
                models.db.session.add(obj)
                models.db.session.commit()
                data = {"id": obj.id}
                
            except Exception as e:
                logging.error("There was an error in loading json POST hotel_reservation request: " + str(e))
                
                return abort(400)
            return jsonify(data), 201
            
            

        #if PATCH update resource
        if request.method == "PATCH":
            try:
                data = request.get_json()
                
                logging.debug("patching data from dict: " + str(data))
                if not data['id']:
                    raise Exception("No hotel id")
                
                obj = self.className.query.filter_by(id = data['id']).first()

                if obj.trip.user != g.user:
                    # if not OAUTH():
                    return abort(401)
                
                obj.update(data)
                logging.debug("this is the edited notes" + str(dest.notes))
                
                # dest.name = data['name']
                # dest.notes = data['notes']
                # dest.trip_order = data['trip_order']
                
                models.db.session.add(obj)
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
                
                obj = self.className.query.filter_by(id = data['id']).first()

                if obj.trip.user != g.user:
                    # if not OAUTH():
                    return abort(401)
                
                models.db.session.delete(obj)
                models.db.session.commit()
            except Exception as e:
                logging.error("There was an error in loading json DELETE request: " + str(e))
                return abort(400)
            
            return Response("Deleted", 200)
        