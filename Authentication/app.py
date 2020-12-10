from flask import Flask, Response, request, jsonify
from flask_cors import CORS, cross_origin
from google.cloud import firestore

app = Flask(__name__)
cors = CORS(app)

# db = firestore.Client()
# userCollection = db.collection('users')


@app.route('/')
@cross_origin()
def test():
    return ('Hello old', 200)


@app.route('/login', methods=['GET', 'POST'])
@cross_origin()
def login():
    if request.method == 'GET':
        return Response('Test login')
    else:
        try:
            data = request.get_json()
            print(data)

            email = data['email']
            password = data['password']

            # TODO: write logic for firestore write and check

            return Response('User logged in Successfully', status=201, mimetype='application/json')

        except Exception as e:
            print(str(e))
            return Response('Auth service Crash', status=500, mimetype='application/json')


@app.route('/register', methods=['GET', 'POST'])
@cross_origin()
def register():
    if request.method == 'GET':
        return Response('Test register')
    else:
        try:
            data = request.get_json()
            print(data)

            name = data['name']
            email = data['email']
            password = data['password']

            # TODO: write logic for firestore write and check

            return Response('User Registered Successfully', status=201, mimetype='application/json')

        except Exception as e:
            print(str(e))
            return Response('Auth service Crash', status=500, mimetype='application/json')


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
