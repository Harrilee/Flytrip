from . import testData
from flask import (
    Blueprint, request, jsonify, session
)
import time

bp = Blueprint('api', __name__, url_prefix='/api')


@bp.route('/purchase', methods=['POST'])
def purchase():
    req = request.json
    print(req)
    return jsonify({'status': 'success'})
    return jsonify({'status': 'failed', 'msg': 'why i failed to purchase?'})


@bp.route('/order', methods=['POST'])
def order():
    req = request.json
    print(req)
    time.sleep(0.5)  # 测试加载效果使用
    return jsonify({'status': 'success', 'data': testData.orderHistory})
    return jsonify({'status': 'failed', 'msg': 'why i failed to purchase?'})
