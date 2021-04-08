import random

from flask import (
    Blueprint, request, jsonify, session
)

bp = Blueprint('api', __name__, url_prefix='/api')


@bp.route('/purchase', methods=['POST'])
def purchase():
    req = request.json
    print(req)
    return jsonify({'status': 'success'})
    return jsonify({'status': 'failed', 'msg': 'why i failed to purchase?'})
