from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

bp = Blueprint('welcome', __name__, url_prefix='/')

@bp.route('/',  methods=('GET', 'POST'))
def welcome():
    return "test"
