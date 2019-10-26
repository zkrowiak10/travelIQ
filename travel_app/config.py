#this substitutes for the .from_mapping config design for subsequent versions of this app
import os

class Config():
    """Base config, uses staging database server."""
    DEBUG = False
    TESTING = False	 
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    @property
    def SQLALCHEMY_DATABASE_URI(self):
        return "postgresql://{}:{}@{}/".format(self.db_user, self.db_password, self.dbhost) + self.DATABASE



class Development(Config):
    SECRET_KEY = 'dev'
    DEBUG = True
    TESTING = True
    db_user = "postgres"
    db_password = os.environ['POSTGRES_ENV_POSTGRES_PASSWORD']
    DATABASE="postgres"
    dbhost = os.environ['POSTGRES_PORT_5432_TCP_ADDR']
    SEND_FILE_MAX_AGE_DEFAULT = 0
    # SQLALCHEMY_ECHO = True

class Testing(Development):
    DATABASE = "mytestdb"