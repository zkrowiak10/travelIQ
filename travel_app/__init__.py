
import os
from travel_app import config, models, models, urls, ajax
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import logging
import sys

logging.basicConfig(level=logging.DEBUG, format="%(levelname)s - %(message)s")
logging.StreamHandler(sys.stdout)

def create_app():
    configEnv = os.getenv('FLASK_ENV')
    if configEnv == "production":
        configParam = config.Production()
        logging.getLogger().setLevel(logging.INFO)
    elif configEnv == 'development':
        configParam = config.Development()
        logging.getLogger().setLevel(logging.DEBUG)
    else:
        logging.error("no environment variable specified")
        raise Exception
    app = Flask(__name__)
    app.config.from_object(configParam)
    app.cli.add_command(models.init_db_command)
    
    models.db.init_app(app)
    migrate = Migrate(app, models.db)
    # ensure the instance folder exists
   
    app.register_blueprint(urls.bp)
    app.register_blueprint(urls.iq)
    app.register_blueprint(ajax.ajax)

    return app


