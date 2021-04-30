import os

from flask import Flask, jsonify, request, session
from flask_cors import CORS

from . import testData


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    CORS(app, resources=r'/*', supports_credentials=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import db, auth, api
    db.init_app(app)
    app.register_blueprint(auth.bp)
    app.register_blueprint(api.bp)

    return app
