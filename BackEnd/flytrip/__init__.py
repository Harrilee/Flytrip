import os
from flask import Flask, request, jsonify, session
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

    from . import db
    db.init_app(app)

    @app.route('/test')
    def test():
        return 'hello world!'



    @app.route('/', methods=['GET'])
    def GETApi():
        print(request.args.get('action'))
        if request.args.get('action') == 'getTickets':  # 用户（非登录）查看所有票
            return jsonify({'status': 'success',
                            'dataSource': testData.dataSource})

    # todo: session & token

    return app