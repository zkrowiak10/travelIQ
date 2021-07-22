
import os
from travel_app import config, models, models, urls, ajax
from flask import Flask
from flask_migrate import Migrate
import logging
import sys

logging.basicConfig(level=logging.DEBUG, format="%(levelname)s - %(message)s")
logging.StreamHandler(sys.stdout) #Send loggint to stout so they are written to heroku logs

# App factory
def create_app():
    configEnv = os.environ['FLASK_ENV']
    if configEnv == "production":
        configParam = config.Production()
        logging.getLogger().setLevel(logging.INFO)
    elif configEnv == 'development':
        configParam = config.Development()
        logging.getLogger().setLevel(logging.DEBUG)
    else:
        raise Exception("{configEnv}is not a valid configuration parameter".format(configEnv=configEnv))
    app = Flask(__name__)
    app.config.from_object(configParam)
    app.cli.add_command(models.init_db_command)
    
    models.db.init_app(app)
    migrate = Migrate(app, models.db)   

    # Register routes
    app.register_blueprint(urls.bp)
    app.register_blueprint(urls.iq)
    app.register_blueprint(ajax.ajax)

    return app


