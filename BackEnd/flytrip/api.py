import datetime

from . import testData
from .auth import *
from .db import *

bp = Blueprint('api', __name__, url_prefix='/api')


@bp.route('/purchase', methods=['POST'])
def purchase():
    req = request.json
    print('req', req)
    print('session', session)
    try:
        db = get_db()
        cursor = db.cursor()
        # validate if there's still remaining seats
        cursor.execute('''
            WITH avaiable_seat as (
                SELECT {classseats} as avaliable
                FROM flight
                         JOIN airplane USING (airline_name, airplane_id)
                WHERE airline_name = %s
                  AND flight_num = %s
                  AND date = %s
            ),
                 sold as (
                     SELECT count(class) as count
                     FROM ticket
                     WHERE airline_name = %s
                       AND flight_num = %s
                       AND date = %s
                       AND class = %s
                 )
            SELECT sold.count<avaiable_seat.avaliable as soldable
            FROM sold, avaiable_seat
        '''.format(classseats=req['ticket_type'] + 'seats'), (req['airline'], req['flight_num'], req['date'],
                                                              req['airline'], req['flight_num'], req['date'],
                                                              req['ticket_type']
                                                              ))
        if cursor.fetchone()['soldable'] == 0:
            return jsonify({'status': 'failed', 'msg': 'Sorry, all tickets were sold out.'})
        elif session['user_type']=='customer':
            cursor.execute('''
            SELECT COUNT(ticket_id) as count
            FROM purchases
            ''')
            next_index = cursor.fetchone()['count'] + 1
            cursor.execute('''
            INSERT INTO ticket(ticket_id, airline_name, flight_num, class, date)
            VALUES (%s, %s, %s, %s, %s)
            ''', (next_index, req['airline'], req['flight_num'], req['ticket_type'], req['date']))
            cursor.execute('''
            INSERT INTO purchases(ticket_id, customer_email, booking_agent_id, purchase_date)
            VALUES(%s,%s,%s,%s)
            ''', (next_index, session['email'], None, datetime.date.today().isoformat())
                           )
            db.commit()
        elif session['user_type']=='agent':
            cursor.execute('''
                        SELECT COUNT(ticket_id) as count
                        FROM purchases
                        ''')
            next_index = cursor.fetchone()['count'] + 1
            cursor.execute('''
            INSERT INTO ticket(ticket_id, airline_name, flight_num, class, date)
            VALUES (%s, %s, %s, %s, %s)
            ''', (next_index, req['airline'], req['flight_num'], req['ticket_type'], req['date']))
            cursor.execute('''
            INSERT INTO purchases(ticket_id, customer_email, booking_agent_id, purchase_date)
            VALUES(%s,%s,%s,%s)
            ''', (next_index, session['email'], None, datetime.date.today().isoformat())
                           )
            db.commit()
        elif session['user_type']=='staff':
            cursor.execute('''
                        SELECT COUNT(ticket_id) as count
                        FROM purchases
                        ''')
            next_index = cursor.fetchone()['count'] + 1
            cursor.execute('''
                        INSERT INTO ticket(ticket_id, airline_name, flight_num, class, date)
                        VALUES (%s, %s, %s, %s, %s)
                        ''', (next_index, req['airline'], req['flight_num'], req['ticket_type'], req['date']))
            cursor.execute('''
                        INSERT INTO purchases(ticket_id, customer_email, booking_agent_id, purchase_date)
                        VALUES(%s,%s,%s,%s)
                        ''', (next_index, req['email'], None, datetime.date.today().isoformat())
                           )
            db.commit()
    except cursor.Error as e:
        print(e)
        return jsonify({'status': 'failed', 'msg': str(e)})
    except Exception as e:
        return jsonify({'status': 'failed', 'msg': 'Inernal error.' + str(e)})
    return jsonify({'status': 'success'})


@bp.route('/order', methods=['POST'])
def order():  # agent和customer共用接口
    req = request.json
    print(req)
    print(session)
    try:
        if session['user_type'] == 'customer':
            email = session['email']
            db = get_db()
            with db.cursor() as cursor:
                cursor.execute('''
                SELECT flight.date,
           airline_name                     airline,
           flight_num,
           departure_time,
           departure_airport,
           arrival_time,
           arrival_airport,
           CASE
               WHEN class = 'BC' THEN BCprice
               WHEN class = 'EC' THEN ECprice
               WHEN class = 'FC' THEN FCprice
               END                          price,
           purchase_date                    purchase_time,
           status,
           customer_email,
           CONCAT(firstname, ' ', lastname) customer_name
    FROM purchases
             JOIN ticket USING (ticket_id)
             JOIN flight USING (flight_num, airline_name)
             JOIN customer ON purchases.customer_email = customer.email
    WHERE customer_email = %s;
    ''', (email,))
                data = cursor.fetchall()
                print(data)
                for index, item in enumerate(data):
                    item['key'] = index
                    item['price'] = float(item['price'])
                    item['departure_city'] = get_city_from_airport(item['departure_airport'])
                    item['arrival_city'] = get_city_from_airport(item['arrival_airport'])
                    item['durationHour'] = (item['arrival_time'] - item['departure_time']).seconds // 3600
                    item['durationMin'] = ((item['arrival_time'] - item['departure_time']).seconds % 3600) // 60
                    item['arrival_time'] = datetime.datetime.strftime(item['arrival_time'], '%H:%M')
                    item['departure_time'] = datetime.datetime.strftime(item['departure_time'], '%H:%M')
                    item['date'] = datetime.datetime.strftime(item['date'], '%Y-%m-%d')
            return jsonify({'status': 'success', 'data': data})

        elif session['user_type'] == 'agent':
            email = session['email']
            db = get_db()
            with db.cursor() as cursor:
                cursor.execute('''
                    SELECT booking_agent_id,
                           flight.date,
                           airline_name                     airline,
                           flight_num,
                           departure_time,
                           departure_airport,
                           arrival_time,
                           arrival_airport,
                           CASE
                               WHEN class = 'BC' THEN BCprice
                               WHEN class = 'EC' THEN ECprice
                               WHEN class = 'FC' THEN FCprice
                               END                          price,
                           purchase_date                    purchase_time,
                           status,
                           customer_email,
                           CONCAT(firstname, ' ', lastname) customer_name
                    FROM purchases
                             JOIN ticket USING (ticket_id)
                             JOIN flight USING (flight_num, airline_name)
                             JOIN customer ON purchases.customer_email = customer.email
                             JOIN booking_agent USING (booking_agent_id)
                    WHERE booking_agent.email = %s;
                    ''', (email,))
                data = cursor.fetchall()
                for index, item in enumerate(data):
                    item['key'] = index
                    item['price'] = float(item['price'])
                    item['departure_city'] = get_city_from_airport(item['departure_airport'])
                    item['arrival_city'] = get_city_from_airport(item['arrival_airport'])
                    item['durationHour'] = (item['arrival_time'] - item['departure_time']).seconds // 3600
                    item['durationMin'] = ((item['arrival_time'] - item['departure_time']).seconds % 3600) // 60
                    item['arrival_time'] = datetime.datetime.strftime(item['arrival_time'], '%H:%M')
                    item['departure_time'] = datetime.datetime.strftime(item['departure_time'], '%H:%M')
                    item['date'] = datetime.datetime.strftime(item['date'], '%Y-%m-%d')
                print(data)
            return jsonify({'status': 'success', 'data': data})

    except pymysql.Error as err:
        return jsonify({'status': 'failed',
                        'msg': err.args[1]})

    except KeyError:
        return jsonify({'status': 'failed', 'msg': 'You are not authorized.'})


@bp.route('/get_status_staff', methods=['GET'])
@staff_login_required
def statusStaffGet():  # staff 拿到“本航司”的status数据，需要所有status的数据
    print(session)
    req = request.json
    print(req)
    try:
        db = get_db()
        with db.cursor() as cursor:
            cursor.execute("SELECT * FROM airline_staff WHERE username = %s;", (session['username'],))
            airline = cursor.fetchone()['airline_name']
            cursor.execute(
                '''
SELECT flight_num,
       arrival_airport,
       departure_airport,
       arrival_time,
       departure_time,
       status,
       airline_name            airline,
        DATE_FORMAT(date, '%%Y-%%m-%%d') date
FROM flight
WHERE airline_name = %s;''',
                (airline,))
            data = cursor.fetchall()
            for index, item in enumerate(data):
                item['key'] = index
                item['durationHour'] = (item['arrival_time'] - item['departure_time']).seconds // 3600
                item['durationMin'] = ((item['arrival_time'] - item['departure_time']).seconds % 3600) // 60
                item['arrive_city'] = get_city_from_airport(item['arrival_airport'])
                item['arrival_city'] = get_city_from_airport(item['arrival_airport'])
                item['depart_city'] = get_city_from_airport(item['departure_airport'])
                item['departure_city'] = get_city_from_airport(item['departure_airport'])
            print(data)

        return jsonify({'status': 'success',
                        'dataSource': data})
    except pymysql.Error as err:
        return jsonify({'status': 'failed',
                        'msg': err.args[1]})
    except Exception as e:
        print('exception:', e)
        return jsonify({'status': 'failed',
                        'msg': 'Unknown error'})


@bp.route('/set_status_staff', methods=['POST'])
@staff_login_required
def statusStaffChange():
    print(session)
    req = request.json
    print(req)
    try:
        db = get_db()
        with db.cursor() as cursor:
            flight_num = req['flight_num']
            date = req['date']
            airline = req['airline']
            status = req['new_status']

            cursor.execute("UPDATE flight SET status = %s WHERE flight_num = %s AND airline_name = %s AND date = %s;",
                           (status, flight_num, airline, date))
            db.commit()
            return jsonify({'status': 'success',
                            'msg': ''})

    except pymysql.Error as err:
        return jsonify({'status': 'failed',
                        'msg': err.args[1]})


@bp.route('/get_passengers', methods=['POST'])
@staff_login_required
def get_passengers():
    req = request.json
    print(req)
    airline = req['airline']
    date = req['date']
    flight_num = req['flight_num']
    db = get_db()
    try:
        data = None
        with db.cursor() as cursor:
            cursor.execute("SELECT * FROM customer JOIN purchases p ON customer.email = p.customer_email "
                           "JOIN ticket t ON p.ticket_id = t.ticket_id"
                           " JOIN flight f ON t.airline_name = f.airline_name AND t.flight_num = f.flight_num"
                           " WHERE f.flight_num = %s AND f.airline_name = %s AND f.date = %s;",
                           (flight_num, airline, date,))
            data = cursor.fetchall()

        result = {'FC': [], 'EC': [], 'BC': []}
        for i in data:
            result[i['class']].append({'name': i['firstname'] + ' ' + i['lastname'],
                                       'firstname': i['firstname'], 'lastname': i['lastname'],
                                       'email': i['email']})
            return jsonify({'status': 'success',
                            'msg': '',
                            'data': result})
    except pymysql.Error as err:
        return jsonify({'status': 'failed',
                        'msg': err.args[1]})


@bp.route('/get_passenger_info', methods=['POST'])
@staff_login_required
def get_passenger_info():
    req = request.json
    print(req)
    email = req['email']
    try:
        db = get_db()
        with db.cursor() as cursor:
            cursor.execute("SELECT * FROM customer WHERE email = %s;", (email,))
            data = cursor.fetchone()
        return jsonify({'status': 'success',
                        'msg': '',
                        'data': data})
    except pymysql.Error as err:
        return jsonify({'status': 'failed',
                        'msg': err.args[1]})


@bp.route('/admin/import_data', methods=['POST'])
@admin_login_required
def import_data():
    try:
        init_db()
        return jsonify({'status': 'success'})
    except:
        return jsonify({'status': 'failed'})


@bp.route('/admin/clear', methods=['POST'])
@admin_login_required
def clear():
    try:
        clear_db()
        return jsonify({'status': 'success'})
    except:
        return jsonify({'status': 'failed'})


@bp.route('/new_flight', methods=['POST'])
@staff_login_required
def addNewFlight():
    print(session)
    req = request.json
    print(req)
    db = get_db()
    flight_num = req['flight_num']
    departure_airport = req['depart_airport']
    arrival_airport = req['arrive_airport']
    departure_time = req['departure_time'][:19]
    arrival_time = req['arrival_time'][:19]
    airplane_id = req['airplane_id']
    EC = req['ECprice']
    FC = req['FCprice']
    BC = req['BCprice']
    try:
        with db.cursor() as cursor:
            cursor.execute("SELECT * FROM airline_staff WHERE username = %s;", (session['username'],))
            airline = cursor.fetchone()['airline_name']
            cursor.execute(
                "INSERT INTO flight(airline_name, flight_num, departure_airport, departure_time, arrival_airport"
                ", arrival_time, ECprice, BCprice, FCprice, status, airplane_id, date) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);",
                (airline, flight_num, departure_airport, departure_time, arrival_airport, arrival_time, EC, BC, FC,
                 'upcoming', airplane_id, departure_time[:10]))
        return jsonify({'status': 'success',
                        'msg': ''})
    except pymysql.Error as err:
        return jsonify({'status': 'failed',
                        'msg': err.args[1]})


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
                "INSERT INTO airplane(airline_name, airplane_id, ECseats, FCseats, BCseats) "
                "VALUES (%s, %s, %s, %s, %s);",
                (airline, ID, EC, FC, BC))
            db.commit()
            return jsonify({'status': 'success',
                            'msg': 'successfully added'})
    except pymysql.Error as err:
        return jsonify({'status': 'failed',
                        'msg': err.args[1]})


@bp.route('/new_airport', methods=['POST'])
@staff_login_required
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
@staff_login_required
def get_selling():
    try:
        db = get_db()
        with db.cursor() as cursor:
            cursor.execute('''
WITH temp_sum AS (
    SELECT purchase_date date,
           CASE
               WHEN class = 'BC' THEN BCprice
               WHEN class = 'FC' THEN FCprice
               WHEN class = 'EC' THEN ECprice
               ELSE ECprice
               END
               price
    FROM purchases
             JOIN ticket USING (ticket_id)
             JOIN flight using (flight_num, date)
    WHERE purchases.purchase_date > DATE_SUB(NOW(), INTERVAL 1 YEAR)
    )
SELECT DATE_FORMAT(date, '%b') month, SUM(price) selling
FROM temp_sum
GROUP BY DATE_FORMAT(date, '%b')
''')
            data = cursor.fetchall()
            month = [{'month': 'Jan', 'selling': 0}, {'month': 'Feb', 'selling': 0}, {'month': 'Mar', 'selling': 0},
                     {'month': 'Apr', 'selling': 0}, {'month': 'May', 'selling': 0}, {'month': 'Jun', 'selling': 0},
                     {'month': 'Jul', 'selling': 0}, {'month': 'Aug', 'selling': 0}, {'month': 'Sep', 'selling': 0},
                     {'month': 'Oct', 'selling': 0}, {'month': 'Nov', 'selling': 0}, {'month': 'Dec', 'selling': 0}]
            for i in data:
                print(i)
                print(i[list(i.keys())[0]])
                for j in month:
                    if j['month'] == i['month']:
                        j['selling'] = int(i['selling'])
            curr = datetime.datetime.today().month
            month = month[curr:] + month[:curr]
            return jsonify({'status': 'success',
                            'data': month,  # 顺序很重要！！
                            'msg': ''})
    except pymysql.Error as err:
        return jsonify({'status': 'failed',
                        'msg': err.args[1]})


@bp.route('/get_top_customer', methods=['GET'])  # for staff
@staff_login_required
def get_top_customer():
    try:
        db = get_db()
        with db.cursor() as cursor:
            cursor.execute('''
WITH SUM_CATEGORY AS (
    WITH TEMP_SUM AS (
        SELECT CONCAT(firstname, ' ', lastname) AS name,
               email,
               class,
               SUM(BCprice)                     AS BC,
               SUM(FCprice)                     AS EC,
               SUM(ECprice)                     AS FC
        FROM ticket
                 JOIN purchases USING (ticket_id)
                 JOIN flight USING (airline_name, flight_num),
             customer
        WHERE customer.email = purchases.customer_email
        GROUP BY email, class
    )
    SELECT name, email, class, BC AS price
    FROM TEMP_SUM
    WHERE class = 'BC'
    UNION
    SELECT name, email, class, EC AS price
    FROM TEMP_SUM
    WHERE class = 'EC'
    UNION
    SELECT name, email, class, FC AS price
    FROM TEMP_SUM
    WHERE class = 'FC'
)
SELECT name, email, SUM(price) AS spending
FROM SUM_CATEGORY
GROUP BY email, name
ORDER BY spending DESC
LIMIT 5;
''')
            data = cursor.fetchall()
            for each in data:
                each['spending'] = int(each['spending'])
            # print(data[0]['spending'])
            return jsonify({'status': 'success',
                            'data': data,
                            'msg': ''})

    except pymysql.Error as err:
        return jsonify({'status': 'failed',
                        'data': [],
                        'msg': err.args[1]})


@bp.route('/agent_get_top_customer_by_ticket', methods=['GET'])  # for agent
@agent_login_required
def get_top_customer_ticket():
    try:
        db = get_db()
        with db.cursor() as cursor:
            cursor.execute('''
SELECT COUNT(*) ticket,  CONCAT(firstname, ' ', lastname) AS name, email
FROM ticket
         JOIN purchases USING (ticket_id),
     customer
WHERE customer.email = purchases.customer_email
GROUP BY email
ORDER BY ticket DESC 
LIMIT 5;
''')
            data = cursor.fetchall()

            return jsonify({'status': 'success',
                            'data': data,
                            'msg': ''})

    except pymysql.Error as err:
        return jsonify({'status': 'failed',
                        'data': [],
                        'msg': err.args[1]})


@bp.route('/agent_get_top_customer_by_commission', methods=['GET'])  # for agent
@agent_login_required
def get_top_customer_commission():
    try:
        agent_id = session['agent_ID']
        db = get_db()
        with db.cursor() as cursor:
            cursor.execute('''
    WITH agent_ticket AS (
    SELECT email,
           CONCAT(firstname, ' ', lastname) name,
           CASE
               WHEN class = 'EC' THEN ECprice
               WHEN class = 'BC' THEN BCprice
               WHEN class = 'FC' THEN FCprice
               END                          price
    FROM purchases
             JOIN ticket USING (ticket_id)
             JOIN flight USING (flight_num, date, airline_name)
             JOIN customer ON purchases.customer_email = customer.email
    WHERE booking_agent_id = %s)
SELECT name, email, SUM(price) commission
FROM agent_ticket
GROUP BY email
''', (agent_id,))
            data = cursor.fetchall()
            for i in data:
                i['commission'] = int(i['commission'])
            return jsonify({'status': 'success',
                            'data': data,
                            'msg': ''})

    except pymysql.Error as err:
        return jsonify({'status': 'failed',
                        'data': [],
                        'msg': err.args[1]})


@bp.route('/get_top_agents', methods=['GET'])
@staff_login_required
def get_top_agents():
    try:
        db = get_db()
        with db.cursor() as cursor:
            cursor.execute('''
   WITH agent_ticket AS (
    SELECT booking_agent_id, email,
           CASE
               WHEN class = 'BC' THEN BCprice
               WHEN class = 'EC' THEN ECprice
               WHEN class = 'FC' THEN FCprice
               END price
    FROM ticket
             NATURAL JOIN purchases
             NATURAL JOIN flight
             NATURAL JOIN booking_agent
    WHERE booking_agent_id IS NOT NULL
      AND date > DATE_SUB(NOW(), INTERVAL 1 YEAR))
SELECT CONCAT('Agent ', booking_agent_id) name, SUM(price) selling, email
FROM agent_ticket
GROUP BY email
ORDER BY selling DESC
LIMIT 5;
''')
            year_commission = cursor.fetchall()
            cursor.execute('''
SELECT CONCAT('Agent ',booking_agent_id) name, COUNT(*) tickets, email
FROM purchases
NATURAL JOIN booking_agent
WHERE booking_agent_id IS NOT NULL
  AND purchase_date > DATE_SUB(NOW(), INTERVAL 1 YEAR)
GROUP BY email
ORDER BY tickets DESC
LIMIT 5;
''')
            year_tickets = cursor.fetchall()
            cursor.execute('''
SELECT CONCAT('Agent ', booking_agent_id) name, COUNT(*) tickets, email
FROM purchases
         NATURAL JOIN booking_agent
WHERE booking_agent_id IS NOT NULL
  AND purchase_date > DATE_SUB(NOW(), INTERVAL 1 MONTH)
GROUP BY email
ORDER BY tickets DESC
LIMIT 5;

''')
            month_tickets = cursor.fetchall()
            for i in year_commission:
                i['selling'] = int(i['selling'])
            return jsonify({'status': 'success',
                            'data': {'year_tickets': year_tickets,
                                     'month_tickets': month_tickets,
                                     'year_commission': year_commission},
                            'msg': ''})

    except pymysql.Error as err:
        return jsonify({'status': 'failed',
                        'data': [],
                        'msg': err.args[1]})


@bp.route('/get_customer_orders', methods=['POST'])  # for staff
@staff_login_required
def get_customer_orders():
    req = request.json
    print(req)
    try:
        email = req['email']
        db = get_db()
        with db.cursor() as cursor:
            cursor.execute('''
            SELECT flight.date,
       airline_name                     airline,
       flight_num,
       departure_time,
       departure_airport,
       arrival_time,
       arrival_airport,
       CASE
           WHEN class = 'BC' THEN BCprice
           WHEN class = 'EC' THEN ECprice
           WHEN class = 'FC' THEN FCprice
           END                          price,
       purchase_date                    purchase_time,
       status,
       customer_email,
       CONCAT(firstname, ' ', lastname) customer_name
FROM purchases
         JOIN ticket USING (ticket_id)
         JOIN flight USING (flight_num, airline_name)
         JOIN customer ON purchases.customer_email = customer.email
WHERE customer_email = %s;
''', (email,))
            data = cursor.fetchall()
            for index, item in enumerate(data):
                item['key'] = index
                item['price'] = float(item['price'])
                item['depart_city'] = get_city_from_airport(item['departure_airport'])
                item['arrive_city'] = get_city_from_airport(item['arrival_airport'])
                item['depart_airport'] = item['departure_airport']
                item['arrive_airport'] = item['arrival_airport']
                item['durationHour'] = (item['arrival_time'] - item['departure_time']).seconds // 3600
                item['durationMin'] = ((item['arrival_time'] - item['departure_time']).seconds % 3600) // 60
                item['arrival_time'] = datetime.datetime.strftime(item['arrival_time'], '%H:%M')
                item['departure_time'] = datetime.datetime.strftime(item['departure_time'], '%H:%M')
                item['date'] = datetime.datetime.strftime(item['date'], '%Y-%m-%d')
                item['purchase_time'] = datetime.datetime.strftime(item['purchase_time'], '%Y-%m-%d %H:%M')
                print(data)
        return jsonify({'status': 'success', 'data': data})

    except pymysql.Error as err:
        return jsonify({'status': 'failed',
                        'msg': err.args[1]})

    except KeyError:
        return jsonify({'status': 'failed', 'msg': 'You are not authorized.'})


@bp.route('/get_selling_by_date', methods=['POST'])
def get_selling_by_date():
    req = request.json
    print(req)
    if len(req['date']) != 2:
        return jsonify({'status': 'failed',
                        'data': 0,
                        'msg': 'wrong arguments'})

    begin = req['date'][0][:10]
    end = req['date'][1][:10]
    print(begin, end)

    try:
        db = get_db()
        with db.cursor() as cursor:
            cursor.execute('''
    WITH purchase_time AS (
    SELECT class,
           purchase_date,
           CASE
               WHEN class = 'BC' THEN BCprice
               WHEN class = 'EC' THEN ECprice
               WHEN class = 'FC' THEN FCprice
               END price
    FROM purchases
             JOIN ticket USING (ticket_id)
             JOIN flight USING (airline_name, flight_num, date)
    WHERE purchase_date > %s
      AND purchase_date < %s)
SELECT IFNULL(SUM(price), 0) sum
FROM purchase_time;
''', (begin, end,))
            data = cursor.fetchone()
            print(data)

            return jsonify({'status': 'success',
                            'data': float(data['sum']),
                            'msg': ''})

    except pymysql.Error as err:
        return jsonify({'status': 'failed',
                        'data': [],
                        'msg': err.args[1]})


@bp.route('/get_selling_statistics', methods=['GET'])
def get_selling_statistics():
    try:
        db = get_db()
        with db.cursor() as cursor:
            cursor.execute('''
WITH total_sum AS (
    SELECT CASE
               WHEN ticket.class = 'EC' THEN ECprice
               WHEN class = 'BC' THEN BCprice
               WHEN class = 'FC' THEN FCprice
               END price
    FROM purchases
             JOIN ticket USING (ticket_id)
             JOIN flight USING (airline_name, flight_num))
SELECT IFNULL(SUM(price),0) total
FROM total_sum;
            ''')
            total = cursor.fetchone()
            print(total)
            print('*' * 100)
            total = float(total['total'])
            cursor.execute('''
WITH year_sum AS (
    SELECT CASE
               WHEN ticket.class = 'EC' THEN ECprice
               WHEN class = 'BC' THEN BCprice
               WHEN class = 'FC' THEN FCprice
               END price
    FROM purchases
             JOIN ticket USING (ticket_id)
             JOIN flight USING (airline_name, flight_num)
    WHERE purchase_date > DATE_SUB(NOW(), INTERVAL 1 YEAR))
SELECT IFNULL(SUM(price),0) total
FROM year_sum;            
            ''')
            year = cursor.fetchone()
            year = float(year['total'])
            cursor.execute('''
            WITH month_sum AS (
                SELECT CASE
                           WHEN ticket.class = 'EC' THEN ECprice
                           WHEN class = 'BC' THEN BCprice
                           WHEN class = 'FC' THEN FCprice
                           END price
                FROM purchases
                         JOIN ticket USING (ticket_id)
                         JOIN flight USING (airline_name, flight_num)
                WHERE purchase_date > DATE_SUB(NOW(), INTERVAL 1 MONTH))
            SELECT IFNULL(SUM(price),0) total
            FROM month_sum;            
                        ''')
            month = cursor.fetchone()
            month = float(month['total'])
        return jsonify({'status': 'success',
                        'data': {
                            'total': total,
                            'year': year,
                            'month': month
                        },
                        'msg': ''})
    except pymysql.Error as err:
        return jsonify({'status': 'failed',
                        'msg': err.args[1]})


@bp.route('/get_source', methods=['GET'])
def get_source():
    try:
        db = get_db()
        with db.cursor() as cursor:
            cursor.execute('''
    WITH total_sum AS (
    SELECT booking_agent_id,
           CASE
               WHEN ticket.class = 'EC' THEN ECprice
               WHEN class = 'BC' THEN BCprice
               WHEN class = 'FC' THEN FCprice
               END price
    FROM purchases
             JOIN ticket USING (ticket_id)
             JOIN flight USING (airline_name, flight_num)
    WHERE purchase_date > DATE_SUB(NOW(), INTERVAL 1 YEAR)
)
SELECT IFNULL(SUM(IF(booking_agent_id IS NOT NULL, 0, price)),0) direct_year,
       IFNULL(SUM(IF(booking_agent_id IS NULL, 0, price)),0)     indirect_year
FROM total_sum;
''')
            year = cursor.fetchone()
            print(year)
            cursor.execute('''
                WITH total_sum AS (
                SELECT booking_agent_id,
                       CASE
                           WHEN ticket.class = 'EC' THEN ECprice
                           WHEN class = 'BC' THEN BCprice
                           WHEN class = 'FC' THEN FCprice
                           END price
                FROM purchases
                         JOIN ticket USING (ticket_id)
                         JOIN flight USING (airline_name, flight_num)
                WHERE purchase_date > DATE_SUB(NOW(), INTERVAL 1 MONTH)
            )
            SELECT IFNULL(SUM(IF(booking_agent_id IS NOT NULL, 0, price)),0) direct_month,
                   IFNULL(SUM(IF(booking_agent_id IS NULL, 0, price)),0)     indirect_month
            FROM total_sum;
            ''')
            month = cursor.fetchone()
        return jsonify({'status': 'success',
                        'data': {
                            'direct_year': float(year['direct_year']),
                            'indirect_year': float(year['indirect_year']),
                            'direct_month': float(month['direct_month']),
                            'indirect_month': float(month['indirect_month'])
                        },
                        'msg': ''})
    except pymysql.Error as err:
        return jsonify({'status': 'failed',
                        'msg': err.args[1]})


@bp.route('/get_destination', methods=['GET'])
def get_destination():
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) COUNT,a.airport_city "
                       " FROM (flight JOIN airport a ON flight.arrival_airport = a.airport_name) "
                       "WHERE departure_time > DATE_SUB(NOW(), INTERVAL 1 YEAR) "
                       "GROUP BY a.airport_city "
                       "ORDER BY COUNT DESC "
                       "LIMIT 3; ")
        result = cursor.fetchall()
        year = []
        for i in result:
            year.append(i['airport_city'])

        cursor.execute("SELECT COUNT(*) COUNT,a.airport_city "
                       " FROM (flight JOIN airport a ON flight.arrival_airport = a.airport_name) "
                       "WHERE departure_time > DATE_SUB(NOW(), INTERVAL 3 MONTH) "
                       "GROUP BY a.airport_city "
                       "ORDER BY COUNT DESC "
                       "LIMIT 3; ")
        result = cursor.fetchall()
        month = []
        for i in result:
            month.append(i['airport_city'])

    return jsonify({'status': 'success',
                    'data': {
                        'threeMonth': month,
                        'year': year,
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


def get_city_from_airport(airport):
    try:
        db = get_db()
        with db.cursor() as cursor:
            cursor.execute("SELECT airport_city FROM airport WHERE airport_name = %s;", (airport,))
            result = cursor.fetchone()
            return result['airport_city']
    except pymysql.Error:
        return 'No such airport'


@bp.route('/search', methods=['GET'])
def search_flight():
    print(session)
    print(request.args)
    if request.args.get('action') == 'getTickets':  # Guest（非登录）查看所有票
        date = request.args.get('date')
        try:
            date = datetime.datetime.utcfromtimestamp(int(int(date) / 1000) - 28800).date()
        except ValueError:
            return jsonify({'status': 'failed',
                            'dataSource': [],
                            'msg': 'Please enter the date.'})
        fr = request.args.get('from')
        to = request.args.get('to')
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""
            SELECT airplane_id,
                   airline_name,
                   date,
                   flight.departure_airport AS departure_airport,
                   d_airport.airport_city   AS departure_city,
                   a_airport.airport_city   AS arrival_city,
                   a_airport.airport_name   AS arrival_airport,
                   FCprice,
                   BCprice,
                   ECprice,
                   departure_time,
                   arrival_time,
                   flight_num
            FROM flight
                     JOIN airport AS d_airport
                     JOIN airport AS a_airport
            WHERE flight.departure_airport = d_airport.airport_name
              AND flight.arrival_airport = a_airport.airport_name
              AND date = %s
              AND (UPPER(%s) = UPPER(d_airport.airport_name) OR UPPER(%s) = UPPER(d_airport.airport_city))
              AND (UPPER(%s)= UPPER(a_airport.airport_name) OR UPPER(%s) = UPPER(a_airport.airport_city))
        """, (date, fr, fr, to, to))

        result = cursor.fetchall()
        for index, item in enumerate(result):
            item['key'] = index
            item['airline'] = item['airline_name']
            item['depart_city'] = get_city_from_airport(item['departure_airport'])
            item['arrive_city'] = get_city_from_airport(item['arrival_airport'])
            item['depart_time'] = item['departure_time'].strftime("%H:%M")
            item['arrive_time'] = item['arrival_time'].strftime("%H:%M")
            item['date'] = date
            item['ECprice'] = int(item['ECprice'])
            item['BCprice'] = int(item['BCprice'])
            item['FCprice'] = int(item['FCprice'])
            delta = item['arrival_time'] - item['departure_time']
            item['durationHour'] = (delta.days * 86400 + delta.seconds) // 3600
            item['durationMin'] = (delta.days * 86400 + delta.seconds) % 3600 // 60
            item['date'] = item['date'].isoformat()
            item['arrival_time'] = item['arrival_time'].strftime('%H:%M')
            item['departure_time'] = item['departure_time'].strftime('%H:%M')
            item['flight_num'] = item['flight_num']
            db = get_db()
            cursor = db.cursor()
            cursor.execute('''
                    WITH sold_ticket_info AS (
                        SELECT COUNT(class) AS sold_tickets, class
                        FROM ticket
                        WHERE airline_name = %s
                          AND flight_num = %s
                          AND date = %s
                        GROUP BY class
                    ),
                         available_ticket_info_temp AS (
                             SELECT ECseats, FCseats, BCseats
                             FROM airplane
                                      JOIN flight USING (airplane_id, airline_name)
                             WHERE airline_name = %s
                               AND flight_num = %s
                               AND date = %s
                         ),
                         available_ticket_info AS (
                             SELECT 'EC' AS class, ECseats AS available
                             FROM available_ticket_info_temp
                             UNION
                             SELECT 'BC' AS class, BCseats AS available
                             FROM available_ticket_info_temp
                             UNION
                             SELECT 'FC' AS class, FCseats AS available
                             FROM available_ticket_info_temp
                         )
                    SELECT class, sold_tickets<available AS soldable
                    FROM available_ticket_info NATURAL JOIN sold_ticket_info
                    ''', (item['airline'], item['flight_num'], date, item['airline'], item['flight_num'], date))
            available_info = cursor.fetchall()
            for each in available_info:
                if each['class'] == 'FC':
                    item['FCSellable'] = True if each['soldable'] else False
                elif each['class'] == 'EC':
                    item['ECSellable'] = True if each['soldable'] else False
                elif each['class'] == 'BC':
                    item['BCSellable'] = True if each['soldable'] else False
            if 'FCSellable' not in item:
                item['FCSellable'] = True
            if 'ECSellable' not in item:
                item['ECSellable'] = True
            if 'BCSellable' not in item:
                item['BCSellable'] = True
        # todo: 这里做模糊搜索吧，如果缺少（部分）信息，则返回全部信息（比如，若航班号和日期均为空，则返回所有可售航班）
        print(result)
        return jsonify({'status': 'success', 'dataSource': result})

    elif request.args.get('action') == 'getStatus':  # Guest 查看所有航班信息
        # todo: 这个也做模糊搜索吧，类似上面
        return jsonify({'status': 'success',
                        'dataSource': testData.statusDataSource})
    else:
        return jsonify({'status': 'failed',
                        'dataSource': [],
                        'msg': 'No result found'})
