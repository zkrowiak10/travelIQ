import os
from travel_app import config, models, models, urls
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import logging

logging.basicConfig(level=logging.ERROR, filename='app.log', format="%(asctime)s - %(levelname)s - %(message)s")

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config.Development())
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

    return app


