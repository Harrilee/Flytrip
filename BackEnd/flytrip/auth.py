import functools
import re

import pymysql
from flask import (Blueprint, jsonify, redirect, request, session, url_for)
from werkzeug.security import generate_password_hash, check_password_hash

from .db import get_db

bp = Blueprint('auth', __name__, url_prefix='/auth')


def admin_login_required(view):
    """
    Define the login_required decorator
    :param view: function to wrap
    :return: if logged in, return the original function, otherwise redirect to login
    """

    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if session.get('user_type') != 'admin':
            return redirect(url_for('auth.login'))
        return view(**kwargs)

    return wrapped_view


def staff_login_required(view):
    """
    Define the login_required decorator
    :param view: function to wrap
    :return: if logged in, return the original function, otherwise redirect to login
    """

    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if session.get('user_type') != 'staff':
            return redirect(url_for('auth.login'))
        return view(**kwargs)

    return wrapped_view


def customer_login_required(view):
    """
    Define the login_required decorator
    :param view: function to wrap
    :return: if logged in, return the original function, otherwise redirect to login
    """

    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if session.get('user_type') != 'customer':
            return redirect(url_for('auth.login'))
        return view(**kwargs)

    return wrapped_view


@bp.route('/register', methods=['POST'])
def register():
    """
    Register function for different accounts
    :return: json string of the status and message
    """
    req = request.json
    db = get_db()
    msg = None
    user_type = req['user_type']
    print(req)
    if user_type == 'customer':
        rules = {
            # 'email': r'[\w\.-]+@[\w\.-]+(\.[\w]+)+',
            # 'password': r'^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$',
        }
        if not check_regex(req, rules):
            msg = 'Password is too simple'
        elif req['password'] != req['password2']:
            msg = "Passwords don't match"
        if msg is None:
            with db.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO customer(email, name, password, building_number, street, city, state, phone_number, "
                    "passport_number, passport_expiration, passport_country, date_of_birth) "
                    " VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                    (
                        req['email'],
                        req['firstname'] + ' ' + req['lastname'],
                        generate_password_hash(req['password']),
                        req['building_number'],
                        req['street'],
                        req['city'],
                        req['state'],
                        req['phone'],
                        req['passport_num'],
                        req['passport_exp'][:10],
                        # TODO: Change the frontend date format
                        req['passport_count'],
                        req['date_of_birth'][:10])
                )
            db.commit()
            return jsonify({'status': 'success'})

    elif user_type == 'agent':
        rules = {
            # 'email': r'[\w\.-]+@[\w\.-]+(\.[\w]+)+'
            # 'password': r'^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$',
        }
        if not check_regex(req, rules):
            msg = 'Password is too simple'
        elif req['password'] != req['password2']:
            msg = "Passwords don't match"
        else:
            try:
                int(req['agent_ID'])
            except ValueError:
                msg = 'Agent ID should be a number'

        if msg is None:
            try:
                with db.cursor() as cursor:
                    cursor.execute(
                        "INSERT INTO booking_agent(email, password, booking_agent_id) "
                        " VALUES(%s, %s, %s)",
                        (
                            req['email'],
                            generate_password_hash(req['password']),
                            req['agent_ID']
                        )
                    )
                db.commit()
            except pymysql.err.IntegrityError as err:
                return jsonify({
                    'status': 'failed',
                    'msg': err.args[1]
                })

            return jsonify({'status': 'success'})

    elif user_type == 'staff':
        rules = {
            # 'email': r'[\w\.-]+@[\w\.-]+(\.[\w]+)+',
            # 'password': r'^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$',
        }
        if not check_regex(req, rules):
            msg = 'Password is too simple'
        if req['password'] != req['password2']:
            msg = "Passwords don't match"

        if msg is None:
            try:
                with db.cursor() as cursor:
                    cursor.execute(
                        "INSERT INTO "
                        "airline_staff(username, password, first_name, last_name, date_of_birth, airline_name) "
                        " VALUES(%s, %s, %s, %s, %s, %s)",
                        (
                            req['username'],
                            generate_password_hash(req['password']),
                            req['firstname'],
                            req['lastname'],
                            req['date_of_birth'][:10],
                            req['airline']
                        )
                    )
                db.commit()
            except pymysql.err.IntegrityError as err:
                return jsonify({
                    'status': 'failed',
                    'msg': err.args[1]
                })

            return jsonify({'status': 'success'})
    return jsonify({'status': 'failed',
                    'msg': msg})


def check_regex(req, rules):
    """
    Check if register info matches the rules
    :param req: dictionary containing the user information
    :param rules: regex rules for the fields
    :return: whether the info matches
    """
    try:
        for rule in rules:
            if re.fullmatch(rule[1], req[rule[0]]) is None:
                return False
        return True
    except KeyError:
        return False


@bp.route('/login', methods=['POST'])
def login():
    """
    User login
    :return: json string of the status and error messages
    """
    req = request.json
    db = get_db()
    user_type = req['user_type']
    password = req['password']
    msg = None
    print('req:', req)
    if user_type == 'customer':
        user = None
        with db.cursor() as cursor:
            if user_type == 'customer':
                cursor.execute(
                    'SELECT * FROM customer WHERE email = %s LIMIT 1;', (req['email'],)
                )
                user = cursor.fetchone()

        if user is None:
            msg = 'Incorrect username.'
        elif not check_password_hash(user['password'], password):
            msg = 'Incorrect password.'

        if msg is None:
            session.clear()
            session['user_type'] = user_type
            session['email'] = req['email']
            print('login function session: ', session)
            return jsonify({
                'status': 'success',
                'user_type': user_type,
                'username': user['name']
            })

        return jsonify({
            'status': 'failed',
            'user_type': user_type,
            'msg': msg
        })

    elif user_type == 'agent':
        user = None
        with db.cursor() as cursor:
            cursor.execute(
                'SELECT * FROM booking_agent WHERE email = %s LIMIT 1;', (req['email'],)
            )
            user = cursor.fetchone()

        if user is None:
            msg = 'Incorrect username.'
        elif not check_password_hash(user['password'], password):
            msg = 'Incorrect password.'
        else:
            try:
                int(req['agent_ID'])
            except ValueError:
                msg = 'Agent ID should be a number.'

        if msg is None:
            session.clear()
            session['user_type'] = user_type
            session['email'] = user['email']
            session['email'] = user['email']
            session['agent_ID'] = user['booking_agent_id']
            print('login function session: ', session)
            return jsonify({
                'status': 'success',
                'user_type': user_type,
                'agent_ID': user['booking_agent_id'],
                'username': user['booking_agent_id']  # 我记得agent注册的时候也有个username的
            })
        return jsonify({
            'status': 'failed',
            'user_type': user_type,
            'msg': msg
        })

    elif user_type == 'staff':
        user = None
        with db.cursor() as cursor:
            cursor.execute(
                'SELECT * FROM airline_staff WHERE username = %s LIMIT 1;', (req['username'],)
            )
            user = cursor.fetchone()

        if user is None:
            msg = 'Incorrect username.'
        elif not check_password_hash(user['password'], password):
            msg = 'Incorrect password.'

        if msg is None:
            session.clear()
            session['user_type'] = user_type
            session['username'] = req['username']
            print('login function session: ', session)
            return jsonify({
                'status': 'success',
                'user_type': user_type,
                'username': req['username']
            })
        return jsonify({
            'status': 'failed',
            'user_type': user_type,
            'msg': msg
        })
    elif user_type == 'admin':
        user = None
        with db.cursor() as cursor:
            cursor.execute(
                'SELECT * FROM admin WHERE admin_name = %s LIMIT 1;', (req['username'],)
            )
            user = cursor.fetchone()

        if user is None:
            msg = 'Incorrect admin ID.'
        elif not check_password_hash(user['password'], password):
            msg = 'Incorrect password.'

        if msg is None:
            session.clear()
            session['user_type'] = user_type
            print('login function session: ', session)
            return jsonify({
                'status': 'success',
                'user_type': user_type,
                'username': req['username']
            })
        return jsonify({
            'status': 'failed',
            'user_type': user_type,
            'msg': msg
        })


@bp.route('/logout', methods=['POST'])
def logout():
    """
    User logout
    :return: json string of status, username and user type
    """
    req = request.json
    print('req:', req)
    session.clear()
    return jsonify({'status': 'success',
                    'user_type': 'login',
                    'username': ''})


@bp.route('/getSessionInfo', methods=['POST'])
# @login_required
# Harry: 我这里前端会报method not allowed的错，先去掉了
def get_session_info():
    """
    Get current session info
    :return: json string of the status and the session info
    """
    req = request.json
    print('req:', req)
    print('session:', session)
    if 'username' in session:
        try:
            print('Session found:', session['username'])
            return jsonify({'status': 'success',
                            'user_type': session['user_type'],
                            'username': session['username']})
        except KeyError:
            print('Wrong session')
            return jsonify({'status': 'failed',
                            'user_type': 'guest',
                            'username': ''})
    else:
        print('No session found')
        session['username'] = '1890'
        print('something')
        print(session)
        return jsonify({'status': 'failed',
                        'user_type': 'guest',
                        'username': ''})
