#this substitutes for the .from_mapping config design for subsequent versions of this app

class Config():
    """Base config, uses staging database server."""
    DEBUG = False
    TESTING = False
    host = "salt.db.elephantsql.com"
    DATABASE="rfxwdoul"

    @property
    def SQLALCHEMY_DATABASE_URI(self):
        return "postgresql://{}/".format(self.host) + self.DATABASE

class Debug(Config):
    SECRET_KEY = 'dev'

class Testing(Debug):
    DEBUG = True
    TESTING = True