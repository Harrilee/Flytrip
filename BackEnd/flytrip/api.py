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
def order():  # agent和customer共用接口
    req = request.json
    print(req)
    time.sleep(0.5)  # 测试加载效果使用
    return jsonify({'status': 'success', 'data': testData.orderHistory})
    return jsonify({'status': 'failed', 'msg': 'why i failed to purchase?'})


@bp.route('/get_status_staff', methods=['GET'])
def statusStaffGet():  # staff 拿到“本航司”的status数据，需要所有status的数据
    print(request.args)
    return jsonify({'status': 'success',
                    'dataSource': testData.statusDataSource})


@bp.route('/set_status_staff', methods=['POST'])
def statusStaffChange():  # staff 拿到“本航司”的status数据，需要所有status的数据
    req = request.json
    print(req)
    return jsonify({'status': 'success',
                    'msg': ''})
    return jsonify({'status': 'failed',
                    'msg': 'just failed'})




@bp.route('/admin/import_data', methods=['POST'])
def import_data():
    return jsonify({'status': 'success'})


@bp.route('/admin/clear', methods=['POST'])
def clear():
    return jsonify({'status': 'success'})

@bp.route('/new_flight', methods=['POST'])
def addNewFlight():
    req = request.json
    print(req)
    return jsonify({'status': 'success',
                    'msg': ''})