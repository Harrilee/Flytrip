import random

from flask import (Blueprint, jsonify, request, session)

bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/register', methods=['POST'])
def register():
    """
    Register the user
    :return: json string of the status and message
    """
    req = request.json
    print('req:', req)
    return jsonify({'status': 'failed',
                    'msg': 'Username is duplicated..'})
    # failed这里可以返回各种创建失败的原因，前端都会显示msg的内容
    return jsonify({'status': 'success'})


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
def getSessionInfo():
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
