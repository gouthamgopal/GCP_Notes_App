from flask import Flask, Response, request, jsonify
from flask_cors import CORS, cross_origin
from google.cloud import firestore
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import json

app = Flask(__name__)
cors = CORS(app)

db = firestore.Client()
userCollection = db.collection(u"users")

SECRET_KEY = 'This is a secret'


@app.route('/')
@cross_origin()
def test():
    return "Hellooo", 200


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

            docs = userCollection.where(u'email', u'==', email).stream()

            for doc in docs:
                user = doc.to_dict()
                if user['email'] == email:
                    if check_password_hash(user['password'], password):
                        jwt_token = jwt.encode({"user": user}, SECRET_KEY)

                        return Response(json.dumps({'token' : jwt_token.decode('UTF-8')}), 200)

                    return Response('Wrong Password', status=403, mimetype='application/json')

            return Response('User does not exist.', status=401, mimetype='application/json')
        except Exception as e:
            print(str(e))
            return Response('Auth login service Crash', status=503, mimetype='application/json')


@app.route('/register', methods=['GET', 'POST'])
@cross_origin()
def register():
    if request.method == 'GET':
        return Response('Test register')
    else:
        try:
            data = request.get_json()
            print(data)

            # TODO: write logic for firestore write and check.
            # Check if user exists already in the system.

            email = data['email']

            docs = userCollection.where(u'email', u'==', email).stream()

            for doc in docs:
                user = doc.to_dict()
                if user['email'] == email:
                    return Response('User already exists', status=202, mimetype='application/json')

            payload = dict(name=data['name'], email=data['email'], password=generate_password_hash(data['password']))

            userCollection.add(payload)

            return Response('User Registered Successfully', status=201, mimetype='application/json')

        except Exception as e:
            print(str(e))
            return Response('Auth register service Crash', status=503, mimetype='application/json')


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
