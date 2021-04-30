import datetime
import random

from . import testData
from .auth import *
from .db import *

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
def statusStaffChange():
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
    try:
        init_db()
        return jsonify({'status': 'success'})
    except:
        return jsonify({'status': 'failed'})


@bp.route('/admin/clear', methods=['POST'])
def clear():
    try:
        clear_db()
        return jsonify({'status': 'success'})
    except:
        return jsonify({'status': 'failed'})


@bp.route('/new_flight', methods=['POST'])
def addNewFlight():
    req = request.json
    print(req)
    return jsonify({'status': 'success',
                    'msg': ''})


@bp.route('/new_plane', methods=['POST'])
@staff_login_required
def addNewPlane():
    req = request.json
    db = get_db()
    print(req)
    ID = req['id']
    EC = req['EC']
    FC = req['FC']
    BC = req['BC']

    try:
        with db.cursor() as cursor:
            cursor.execute("SELECT * FROM airline_staff WHERE username = %s;", (session['username'],))
            airline = cursor.fetchone()['airline_name']
            cursor.execute(
                "INSERT INTO airplane(airline_name, airplane_id, ECseats, FCseats, BCseats) VALUES (%s, %s, %s, %s, %s);",
                (airline, ID, EC, FC, BC))
            db.commit()
            return jsonify({'status': 'success',
                            'msg': 'successfully added'})
    except pymysql.Error as err:
        return jsonify({'status': 'failed',
                        'msg': err.args[1]})


@bp.route('/new_airport', methods=['POST'])
def addNewAirport():
    req = request.json
    db = get_db()
    name = req['name']
    city = req['city']
    print(name)
    print(city)
    try:
        with db.cursor() as cursor:
            cursor.execute("INSERT INTO airport(airport_name, airport_city) VALUES (%s, %s);", (name, city,))
            db.commit()
            return jsonify({'status': 'success',
                            'msg': 'successfully added'})
    except pymysql.Error as err:
        return jsonify({'status': 'failed',
                        'msg': err.args[1]})


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


def get_cities():
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute("SELECT DISTINCT airport_city FROM airport;")
        result = cursor.fetchall()
        cities = []
        for i in result:
            cities.append(i['airport_city'])
        return cities


@bp.route('/search', methods=['GET'])
def search_flight():
    print(session)
    print(request.args)
    if request.args.get('action') == 'getTickets':  # Guest（非登录）查看所有票
        date = request.args.get('date')
        date = datetime.datetime.utcfromtimestamp(int(int(date) / 1000) - 28800).date()
        stat = "SELECT * FROM ticket NATURAL JOIN flight NATURAL JOIN airport NATURAL JOIN airplane WHERE status = 'upcoming' AND date = %s"
        print(date)
        fr = request.args.get('from')
        to = request.args.get('to')
        db = get_db()
        cities = get_cities()
        if fr in cities:
            stat += " AND departure_airport IN (SELECT airport_name FROM airport WHERE airport_city = %s)"
        else:
            stat += " AND departure_airport = %s"

        if to in cities:
            stat += " AND arrival_airport IN (SELECT airport_name FROM airport WHERE airport_city = %s)"
        else:
            stat += " AND arrival_airport = %s"

        with db.cursor() as cursor:
            cursor.execute(stat, (date, fr, to,))
            result = cursor.fetchall()
        print(result)
        ret = []
        for index, item in enumerate(result):
            item['key'] = index
            item['airline'] = item['airline_name']
            item['depart_city'] = 'Shanghai'
            item['arrive_city'] = 'Beijing'
            item['depart_time'] = item['departure_time'].strftime("%H:%M")
            item['arrive_time'] = item['arrival_time'].strftime("%H:%M")
            item['date'] = date
            item['ECprice'] = int(item['ECprice'])
            item['BCprice'] = int(item['BCprice'])
            item['FCprice'] = int(item['FCprice'])
            remain = {}

            with db.cursor() as cursor:
                cursor.execute(
                    "SELECT COUNT(ticket_id) count, class FROM ticket WHERE airline_name = %s AND flight_num = %s GROUP BY class;",
                    (item['airline_name'], item['flight_num'],))
                remaining = cursor.fetchall()
            print(remaining)
            print('a')
            for i in remaining:
                if i['class'] == 'BC':
                    remain['BC'] = i['count']
                if i['class'] == 'EC':
                    remain['EC'] = i['count']
                if i['class'] == 'FC':
                    remain['FC'] = i['count']

            item['FCSellable'] = remain['FC'] < item['FCseats']
            item['BCSellable'] = remain['BC'] < item['BCseats']
            item['ECSellable'] = remain['EC'] < item['ECseats']

            item['durationHour'] = (item['arrival_time'] - item['departure_time']).seconds // 3600
            item['durationMin'] = ((item['arrival_time'] - item['departure_time']).seconds % 3600) // 60

            ret.append(item)
        print(ret)

        # todo: 这里做模糊搜索吧，如果缺少（部分）信息，则返回全部信息（比如，若航班号和日期均为空，则返回所有可售航班）
        return jsonify({'status': 'success',
                        'dataSource': result})
    elif request.args.get('action') == 'getStatus':  # Guest 查看所有航班信息
        # todo: 这个也做模糊搜索吧，类似上面
        return jsonify({'status': 'success',
                        'dataSource': testData.statusDataSource})
