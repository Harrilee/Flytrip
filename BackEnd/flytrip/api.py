from . import testData
from flask import (
    Blueprint, request, jsonify, session
)
import time
import random

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
    if session['user_type'] == 'customer':
        return jsonify({'status': 'success', 'data': testData.orderHistoryCustomer})

    elif session['user_type'] == 'agent':
        return jsonify({'status': 'success', 'data': testData.orderHistoryAgent})
    else:
        return jsonify({'status': 'failed', 'msg': 'You are not authorized.'})


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


@bp.route('/get_passengers', methods=['POST'])
def get_passengers():
    req = request.json
    print(req)
    return jsonify({'status': 'success',
                    'msg': '',
                    'data': testData.passengers})
    return jsonify({'status': 'failed',
                    'msg': 'just failed'})


@bp.route('/get_passenger_info', methods=['POST'])
def get_passenger_info():
    req = request.json
    print(req)
    return jsonify({'status': 'success',
                    'msg': '',
                    'data': testData.passenger_info})
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


@bp.route('/new_plane', methods=['POST'])
def addNewPlane():
    req = request.json
    print(req)
    return jsonify({'status': 'success',
                    'msg': ''})


@bp.route('/new_airport', methods=['POST'])
def addNewAirport():
    req = request.json
    print(req)
    return jsonify({'status': 'success',
                    'msg': ''})


@bp.route('/get_selling', methods=['GET'])  # for bar chart
def get_selling():
    return jsonify({'status': 'success',
                    'data': testData.selling,  # 顺序很重要！！
                    'msg': ''})


@bp.route('/get_top_customer', methods=['GET'])  # for staff
def get_top_customer():
    return jsonify({'status': 'success',
                    'data': testData.top_customer,
                    'msg': ''})


@bp.route('/agent_get_top_customer_by_ticket', methods=['GET'])  # for agent
def get_top_customer_ticket():
    return jsonify({'status': 'success',
                    'data': testData.top_customer_ticket,
                    'msg': ''})


@bp.route('/agent_get_top_customer_by_commission', methods=['GET'])  # for agent
def get_top_customer_commission():
    return jsonify({'status': 'success',
                    'data': testData.top_customer_commission,
                    'msg': ''})


@bp.route('/get_top_agents', methods=['GET'])
def get_top_agents():
    return jsonify({'status': 'success',
                    'data': {'year_tickets': testData.top_agent,
                             'month_tickets': testData.top_agent,
                             'year_commission': testData.top_agent},
                    'msg': ''})


@bp.route('/get_customer_orders', methods=['POST'])
def get_customer_orders():
    req = request.json
    print(req)
    return jsonify({'status': 'success',
                    'data': testData.orderHistoryCustomer,
                    'msg': ''})


@bp.route('/get_selling_by_date', methods=['POST'])
def get_selling_by_date():
    req = request.json
    print(req)
    return jsonify({'status': 'success',
                    'data': random.random() * 100,
                    'msg': ''})


@bp.route('/get_selling_statistics', methods=['GET'])
def get_selling_statistics():
    return jsonify({'status': 'success',
                    'data': {
                        'total': random.random() * 100,
                        'year': random.random() * 100,
                        'month': random.random() * 100
                    },
                    'msg': ''})


@bp.route('/get_source', methods=['GET'])
def get_source():
    return jsonify({'status': 'success',
                    'data': {
                        'direct_year': random.random() * 10000,
                        'indirect_year': random.random() * 10000,
                        'direct_month': random.random() * 10000,
                        'indirect_month': random.random() * 10000,
                    },
                    'msg': ''})


@bp.route('/get_destination', methods=['GET'])
def get_destination():
    return jsonify({'status': 'success',
                    'data': {
                        'threeMonth': ['Shanghai', 'Chengdu', 'Hangzhou'],
                        'year': ['Shanghai', 'Hangzhou', 'Chengdu'],
                    },
                    'msg': ''})
