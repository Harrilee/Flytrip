from flask import Flask, request, jsonify
from flask_cors import CORS
import testData
app = Flask(__name__)
CORS(app, resources=r'/*', supports_credentials=True)


@app.route('/', methods=['POST'])
def POSTApi():
    req = request.json
    print('req:', req)

    if req['action'] == 'register': # 注册请求
        return jsonify({'status': 'failed',
                        'msg': 'Username is duplicated..'})
        # failed这里可以返回各种创建失败的原因，前端都会显示msg的内容
        return jsonify({'status': 'success'})

    elif req['action'] == 'login': # 登录请求
        return jsonify({'status': 'failed',
                        'msg': 'Username and password are inconsistent.'})
        # failed这里可以返回各种创建失败的原因，前端都会显示msg的内容
        return jsonify({'status': 'success',
                       'user_type': 'customer'})


    return jsonify({'msg': 'Unknown action'})

@app.route('/', methods=['GET'])
def GETApi():
    print(request.args)
    if request.args.get('action')=='getTickets': # 用户（非登录）查看所有票
        return jsonify({'status': 'success',
                        'dataSource': testData.dataSource})
# todo: session & token

app.run(port=5000)
