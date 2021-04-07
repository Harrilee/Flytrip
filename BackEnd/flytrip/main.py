from flask import Flask, request, jsonify, session
from flask_cors import CORS
import testData
import random

app = Flask(__name__)
app.secret_key = 'kbckjbckjxnsudhciuhckjn'
CORS(app, resources=r'/*', supports_credentials=True)


@app.route('/', methods=['POST'])
def POSTApi():
    req = request.json
    print('req:', req)

    if req['action'] == 'register':  # 注册请求
        return jsonify({'status': 'failed',
                        'msg': 'Username is duplicated..'})
        # failed这里可以返回各种创建失败的原因，前端都会显示msg的内容
        return jsonify({'status': 'success'})



    return jsonify({'msg': 'Unknown action'})


@app.route('/', methods=['GET'])
def GETApi():
    print(session)
    print(request.args)
    if request.args.get('action') == 'getTickets':  # Guest（非登录）查看所有票
        return jsonify({'status': 'success',
                        'dataSource': testData.ticketDataSource})
    elif request.args.get('action') == 'getStatus':  # Guest 查看所有航班信息
        return jsonify({'status': 'success',
                        'dataSource': testData.statusDataSource})

@app.route('/auth/login', methods=['POST'])
def login():
    req = request.json
    print('req:', req)
    if random.choice([True]):  # 用户登录成功
        session['user_type'] = req['user_type']  # 从数据库中获取
        session['username'] = '从数据库里面找到对应的用户名'  # 从数据库中获取
        print('after adding session:', session)
        print(120)
        return jsonify({'status': 'success',
                        'user_type': session['user_type'],
                        'username': session['username']})
    else:  # 登录验证失败
        # failed这里可以返回各种创建失败的原因，前端都会显示msg的内容
        return jsonify({'status': 'failed',
                        'msg': 'Username and password are inconsistent.'})

@app.route('/auth/getSessionInfo', methods=['POST'])
def getSessionInfo():
    req = request.json
    print('req:', req)
    print('session:',session)
    if 'username' in session:
        print('Session found:', session['sessionID'])
        return jsonify({'status': 'success',
                        'user_type': session['user_type'],
                        'username': session['username']})
    else:
        print('No session found')
        session['username'] = '1890'
        print(session)
        return jsonify({'status': 'failed',
                        'user_type': 'guest',
                        'username': ''})

app.run(port=5000)