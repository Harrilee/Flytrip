import functools
import random
import re

from flask import (Blueprint, g, jsonify, redirect, request, session, url_for)

from .db import get_db

bp = Blueprint('auth', __name__, url_prefix='/auth')


def login_required(view):
    """
    Define the login_required decorator
    :param view: function to wrap
    :return: if logged in, return the original function, otherwise redirect to login
    """

    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.login'))

        return view(**kwargs)

    return wrapped_view


@bp.before_app_request
def load_logged_in_user():
    user_email = session.get('user_id')

    if user_email is None:
        g.user = None
    else:
        db = get_db()
        with db.cursor() as cursor:
            g.user = cursor.execute(
                'SELECT * FROM customer WHERE email = %s', (user_email,)
            ).fetchone()
            print(g.user)


@bp.route('/register', methods=['POST'])
def register():
    """
    Register function for different accounts
    :return: json string of the status and message
    """
    req = request.json
    print('req:', req)
    db = get_db()
    msg = None
    if req['user_type'] == 'customer':
        rules = {
            # 'email': r'[\w\.-]+@[\w\.-]+(\.[\w]+)+',
            # 'password': r'^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$',
        }
        if not check_regex(req, rules):
            msg = 'Password is too simple'
        if req['password'] != req['password2']:
            msg = "Passwords don't match"
        if msg is None:
            with db.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO customer(email, name, password, building_number, street, city, state, phone_number, "
                    "passport_number, passport_expiration, passport_country, date_of_birth) "
                    " VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                    (req['email'], req['firstname'] + req['lastname'], req['password'], req['building_number'],
                     req['street'], req['city'], req['state'], req['phone'], req['passport_num'],
                     req['passport_exp'][:10], req['passport_count'], req['date_of_birth'][:10])
                )
            db.commit()
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
    print('req:', req)
    if random.choice([True]):  # 用户登录成功
        session['user_type'] = req['user_type']  # 从数据库中获取
        session['username'] = '从数据库里面找到对应的用户名'  # 从数据库中获取
        print('after adding session:', session)
        return jsonify({'status': 'success',
                        'user_type': session['user_type'],
                        'username': session['username']})
    else:  # 登录验证失败
        # failed这里可以返回各种创建失败的原因，前端都会显示msg的内容
        return jsonify({'status': 'failed',
                        'msg': 'Username and password are inconsistent.'})


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
@login_required
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
        print(session)
        return jsonify({'status': 'failed',
                        'user_type': 'guest',
                        'username': ''})
