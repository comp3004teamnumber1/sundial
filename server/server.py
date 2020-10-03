import flask
import json
import requests

app = flask.Flask(__name__)
app.config['DEBUG'] = True

@app.route ('/', methods=['GET'])
def home():
  api_return = requests.get('https://jsonplaceholder.typicode.com/posts')
  return flask.Response(json.dumps(api_return.json()), mimetype='application/json')

app.run()
