import os
import tempfile
import pytest
from travel_app import create_app
from travel_app.config import Testing
from travel_app.models import init_db_command, db
from travel_app import models as m


@pytest.fixture
def app():

    app = create_app(configParam=Testing())
    with app.app_context():
        db.drop_all()
        db.create_all()
        
        yield app

        db.drop_all()

def test_dummy():
    assert True

def test_raises():
    with pytest.raises(AssertionError):
        assert False

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()

def test_register(app):
    with app.app_context():

        # creating test now for email parsing
        with pytest.raises(AssertionError):
            m.User.register("TestUser1","bademail.com", "password")
        user = m.User("TestUser1","email@server.com", "password")

        # check duplicate users
        with pytest.raises(Exception):
            m.User("TestUser1","email@server.com", "password")
            m.User("TestUser1","email@server.com", "password")


def test_ajax(client):

        response = client.post("/ajax/destinations")
        assert response.status == 401

        