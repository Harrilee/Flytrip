from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources=r'/*', supports_credentials=True)


@app.route('/', methods=['POST'])
def handle_register():
    print('request.json:', request.json)
    return jsonify({'status': 'failed',
                    'msg':'Username is duplicated.'})
    return jsonify({'status': 'success'})


# todo: session & token

app.run(port=5000)
