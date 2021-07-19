
import os
from travel_app import config, models, models, urls, ajax
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import logging

logging.basicConfig(level=logging.DEBUG, filename='app.log', format="%(levelname)s - %(message)s")

def create_app(configParam = None):
    configEnv = os.environ('FLASK_ENV')
    if configEnv == "production":
        configParam = config.Production()
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(configParam)
    app.cli.add_command(models.init_db_command)
    models.db.init_app(app)
    migrate = Migrate(app, models.db)
    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    logging.debug('test log')
    app.register_blueprint(urls.bp)
    app.register_blueprint(urls.iq)
    app.register_blueprint(ajax.ajax)

    return app


