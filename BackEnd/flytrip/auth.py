import random

from flask import (
    Blueprint, request, jsonify, session
)

bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/', methods=['POST'])
def POSTApi():
    req = request.json
    print('req:', req)

    if req['action'] == 'register':  # 注册请求
        return jsonify({'status': 'failed',
                        'msg': 'Username is duplicated..'})
        # failed这里可以返回各种创建失败的原因，前端都会显示msg的内容
        return jsonify({'status': 'success'})

    elif req['action'] == 'login':  # 登录请求
        return jsonify({'status': 'failed',
                        'msg': 'Username and password are inconsistent.'})
        # failed这里可以返回各种创建失败的原因，前端都会显示msg的内容
        return jsonify({'status': 'success',
                        'user_type': 'customer'})

    return jsonify({'msg': 'Unknown action'})


@bp.route('/login', methods=['POST'])
def login():
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
    req = request.json
    print('req:', req)
    session.clear()
    return jsonify({'status': 'success',
                    'user_type': 'login',
                    'username': ''})


@bp.route('/getSessionInfo', methods=['POST'])
def getSessionInfo():
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
