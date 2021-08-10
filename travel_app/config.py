# this substitutes for the .from_mapping config design for subsequent versions of this app
import os


class Config():
    DEBUG = False
    TESTING = False
    SECRET_KEY = 'dev'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    @property
    def SQLALCHEMY_DATABASE_URI(self):
        return "postgresql://{}:{}@{}/".format(self.db_user, self.db_password, self.dbhost) + self.DATABASE


class Development(Config):
    db_user = "postgres"
    db_password = os.getenv('POSTGRES_ENV_POSTGRES_PASSWORD')
    DATABASE = "dev_db"
    dbhost = 'localhost:5432'
    SECRET_KEY = 'dev'
    DEBUG = True


class Staging(Development):
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.getenv('SECRET_KEY')


class Production(Config):
    @property
    def SQLALCHEMY_DATABASE_URI(self):
        # Heroku requires postgresql as uri protocol (not postgres)
        uri = os.getenv("DATABASE_URL")  # or other relevant config var
        if uri != None:
            if uri.startswith("postgres://"):
                uri = uri.replace("postgres://", "postgresql://", 1)
            return uri
