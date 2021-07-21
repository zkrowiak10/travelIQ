import logging

from flask import (
    jsonify, abort, Response
)

from travel_app import models

# Class to recieve API requests from the ajax module and handle operations on the data
# Subsequent versions of this app will more strongly enforce this design architecture so that app routing
# functions operate solely as dispatchers to this underlying driver.
# Current version of the app no longer calls this, but it will be re-implemented in subsequent iterations.
class API ():

    # Instance of the API driver receives SQLAlchemy class definition 
    def __init__(self, className):
        self.className = className

    # Prepare python lists for jsonify
    @staticmethod
    def serializeList(obj_list):
        data = []
        for obj in obj_list:
            if obj != None:
                dict = API.serializeItem(obj)
                data.append(dict)
        return data

    # prepare python SQLAlchemy dictionaries for jsonify by removing SQLAlchemy metadata
    def serializeItem(obj : dict):
        dict = {}
        logging.debug("Serializing object with dictionary:" + str(obj.__dict__))
        dict = {key:obj.__dict__[key] for key in obj.__dict__ if obj.__dict__[key] != "_sa_instance_state"}
        return dict

    # Handle GET, POST, PATCH, and DELETE requests to database
    def api_driver(self, request : Request):

         # TODO: Add security logic to prevent modifications to unauthorized resources
        if request.method == "GET":
            try:
                obj_list = self.className.query.filter_by().all()
                data = API.serializeList(obj_list)
                return jsonify(data)
            except Exception as e:
                logging.error(
                    "There was an error in loading json GET request: " + str(e))
                return abort(400)
       
        # if not GET, expect data
        data = request.get_json()

        # boolean values in JSON had evaluate to strings. Fix.
        for key, value in data.items():
            if value == "True":
                data[key] = True
            if value == 'False':
                data[key] = False

        logging.debug("Storing new object with request data: " + str(data))
        if request.method == "POST":
            try:
                # need to improve this class method to handle nested fields.
                obj = self.className(**data)
                models.db.session.add(obj)
                models.db.session.commit()
                
                # return the primary key of the newly created object so the application can make updates.
                data = {"id": obj.id}
                return jsonify(data), 201
            except Exception as e:
                logging.error(
                    "There was an error in loading json POST hotel_reservation request: " + str(e))
                return abort(400)
            
        if request.method == "PATCH":
            try:
                logging.debug("patching data from dict: " + str(data))
                if not data['id']:
                    raise Exception("Ilegal call to PATCH. Must specify primary key of target record")

                obj = self.className.query.filter_by(id=data['id']).first() 

                if not obj:
                    abort(404)

                obj.update(data)
    

                models.db.session.add(obj)
                models.db.session.commit()
                return Response("Updated", 200)
            except Exception as e:
                logging.error("There was an error in loading json PATCH: " + str(e))
                return abort(500)

        # if DELETE delete resource
        if request.method == "DELETE":
            # check auth
            try:
                if not data['id']:
                    raise Exception("Ilegal call to DELETE. Must specify primary key of target record")

                obj = self.className.query.filter_by(id=data['id']).first()

                if not obj:
                    abort(404)
                models.db.session.delete(obj)
                models.db.session.commit()

                return Response("Deleted", 200)
            except Exception as e:
                logging.error(
                    "There was an error in loading json DELETE request: " + str(e))
                return abort(500)

            
