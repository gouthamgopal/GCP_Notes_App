from flask import Flask, Response, request, jsonify
from flask_cors import CORS, cross_origin
from google.cloud import firestore
import jwt
import json

app = Flask(__name__)
cors = CORS(app)

SECRET_KEY = 'This is a secret'

db = firestore.Client()
notesCollection = db.collection(u"notes")


@app.route('/')
@cross_origin()
def test():
    return 'Hello from Notes', 200


@app.route('/add', methods=['GET', 'POST'])
@cross_origin()
def add_note():
    if request.method == 'GET':
        return 'Test add note service', 200
    else:
        try:
            auth_header = request.headers.get('Authorization')
            data = request.get_json()

            if auth_header:
                auth_token = auth_header.split(" ")[1]
            else:
                auth_token = ''

            if auth_token != '':
                user = jwt.decode(auth_token, SECRET_KEY)["user"]

                topic = data['topic']
                content = data['content']
                date = data['date']

                payload = {
                    u'email': user['email'],
                    u'topic': topic,
                    u'content': content,
                    u"date": date
                }

                notesCollection.add(payload)

                return Response("Note added successfully", status=200, mimetype='application/json')
            else:
                return Response('User details not foudn', status=404, mimetype='application/json')

        except Exception as e:
            print(str(e))
            return Response('Notes: add service crash', status=503, mimetype='application/json')


@app.route('/update', methods=['GET', 'PUT'])
@cross_origin()
def update_note():
    if request.method == 'GET':
        return "Update service test", 200
    else:
        try:
            auth_header = request.headers.get('Authorization')
            data = request.get_json()

            if auth_header:
                auth_token = auth_header.split(" ")[1]
            else:
                auth_token = ''

            if auth_token != '':
                user = jwt.decode(auth_token, SECRET_KEY)["user"]

                topic = data['topic']
                content = data['content']
                date = data['date']

                payload = {
                    u'email': user['email'],
                    u'topic': topic,
                    u'content': content,
                    u"date": date
                }

                docs = notesCollection.where(u'email', u'==', user['email']).where(u'topic', u'==', topic).stream()

                # Deleting previous references of the topic
                for doc in docs:
                    doc.reference.delete()

                # Adding new document for the specified topic
                notesCollection.add(payload)

                return Response("Note updated successfully", status=200, mimetype='application/json')
            else:
                return Response('User details not foudn', status=404, mimetype='application/json')

        except Exception as e:
            print(str(e))
            return Response('Notes: update service crash', status=503, mimetype='application/json')


@app.route('/delete', methods=['GET'])
@cross_origin()
def delete_note():
    if request.method == 'GET':
        try:
            print('Inside delete function')
            auth_header = request.headers.get('Authorization')
            args = request.args

            print('args', args)

            if auth_header:
                auth_token = auth_header.split(" ")[1]
            else:
                auth_token = ''

            if auth_token != '':
                user = jwt.decode(auth_token, SECRET_KEY)["user"]

                email = user['email']
                topic = args['topic']

                print('topic', topic)

                if topic == '':
                    return Response('No topic mentioned', status=404, mimetype='application/json')

                docs = notesCollection.where(u'email', u'==', email).where(u'topic', u'==', topic).stream()

                if len(docs) == 0:
                    return Response('No such file found', status=404, mimetype='application/json')

                for doc in docs:
                    doc.reference.delete()

                return Response('Note deleted successfully', status=200, mimetype='application/json')
            else:
                return Response('User details not foudn', status=404, mimetype='application/json')

        except Exception as e:
            print(str(e))
            return Response('Notes: delete service crash', status=503, mimetype='application/json')


@app.route('/fetch', methods=['GET'])
@cross_origin()
def fetch_note():
    if request.method == 'GET':
        try:
            auth_header = request.headers.get('Authorization')

            if auth_header:
                auth_token = auth_header.split(" ")[1]
            else:
                auth_token = ''

            if auth_token != '':
                user = jwt.decode(auth_token, SECRET_KEY)["user"]

                documents = []

                docs = notesCollection.where(u'email', u'==', user['email']).stream()

                for doc in docs:
                    note = doc.to_dict()

                    documents.append(note)

                return Response(json.dumps(documents), status=200, mimetype='application/json')
            else:
                return Response('User details not foudn', status=404, mimetype='application/json')

        except Exception as e:
            print(str(e))
            return Response('Notes: fetch service crash', status=503, mimetype='application/json')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
