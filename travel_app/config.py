#this substitutes for the .from_mapping config design for subsequent versions of this app
import os

# class Config():
#     """Base config, uses staging database server."""
#     DEBUG = False
#     TESTING = False	 
#     SQLALCHEMY_TRACK_MODIFICATIONS = False
#     @property
#     def SQLALCHEMY_DATABASE_URI(self):
#         return "postgresql://{}:{}@{}/".format(self.db_user, self.db_password, self.dbhost) + self.DATABASE

# class Debug(Config):
#     SECRET_KEY = 'dev'

# class Testing(Debug):
#     DEBUG = True
#     TESTING = True

# class Development(Testing):
#     db_user = "postgres"
#     db_password = os.environ['POSTGRES_ENV_POSTGRES_PASSWORD']
#     DATABASE="postgres"
#     dbhost = 'postgres:5432'
#     # SQLALCHEMY_ECHO = True

class Production():
    SECRET_KEY = os.urandom(24)
    SQLALCHEMY_DATABASE_URI= os.environ['DATABASE_URL']