import os
from travel_app import config, models
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config.Testing())
    app.cli.add_command(models.init_db_command)
    models.db.init_app(app)
    
    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    

    return app


