import flask
import json
import requests
import config
from datetime import datetime

app = flask.Flask(__name__)
config = config.Config()
app.config['DEBUG'] = True

@app.route ('/weekly', methods=['GET'])
def weekly():
  api_url = 'http://api.openweathermap.org/data/2.5/onecall?lat={}&lon={}&appid={}'.format('45.424721', '-75.695000', config.OWM_API_KEY)
  api_return = requests.get(api_url)
  weather_data = api_return.json()
  days = []
  for weather in weather_data['daily']:
    celsius = round(weather['temp']['day'] - 273.15, 1)
    fahrenheit = round((weather['temp']['day'] - 273.15) * 9/5 + 32, 1)
    day = {'date': weather['dt'], 'temp': {'c': celsius, 'f': fahrenheit, 'k': round(weather['temp']['day']}, 1), 'weather': weather['weather'][0]['main']}
    days.append(day)

  return flask.Response(json.dumps(days), mimetype='application/json')

app.run()
