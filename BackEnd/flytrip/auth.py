import functools
from flask import (
    Blueprint, request, jsonify, session, g
)
from werkzeug.security import check_password_hash, generate_password_hash

from .db import get_db

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
