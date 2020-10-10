import flask
import json
import requests
import config
import uuid
from datetime import datetime

app = flask.Flask(__name__)
config = config.Config()
sessions = {}
app.config["DEBUG"] = True


@app.route("/login", methods=["POST"])
def login():
    session_key = uuid.uuid4()
    post_args = flask.request.json
    username = post_args.get("username")
    password = post_args.get("password")
    if username and password:
        sessions[username] = str(session_key)
        return {"status": 200, "session_key": sessions[username]}, 200
    return {"status": 401}, 401


@app.route("/daily", methods=["GET"])
def daily():
    api_url = (
        "http://api.openweathermap.org/data/2.5/onecall?lat={}&lon={}&appid={}".format(
            "45.424721", "-75.695000", config.OWM_API_KEY
        )
    )
    api_return = requests.get(api_url)
    weather_data = api_return.json()
    days = {"days": []}
    for weather in weather_data["daily"]:
        day = {
            "date": weather["dt"],
            "temp": {
                "c": round(weather["temp"]["day"] - 273.15, 1),
                "f": round((weather["temp"]["day"] - 273.15) * 9 / 5 + 32, 1),
                "k": round(weather["temp"]["day"], 1),
            },
            "feels_like": {
                "temp": {
                    "c": round(weather["feels_like"]["day"] - 273.15, 1),
                    "f": round((weather["feels_like"]["day"] - 273.15) * 9 / 5 + 32, 1),
                    "k": round(weather["feels_like"]["day"], 1),
                }
            },
            "pop": weather["pop"],
            "humidity": weather["humidity"],
            "weather_type": weather["weather"][0]["main"],
        }
        days["days"].append(day)

    return days, 200


@app.route("/hourly", methods=["GET"])
def hourly():
    api_url = (
        "http://api.openweathermap.org/data/2.5/onecall?lat={}&lon={}&appid={}".format(
            "45.424721", "-75.695000", config.OWM_API_KEY
        )
    )
    api_return = requests.get(api_url)
    weather_data = api_return.json()
    hours = {"hours": []}
    for weather in weather_data["hourly"]:
        if len(hours) > 23:
            break
        hour = {
            "date": weather["dt"],
            "temp": {
                "c": round(weather["temp"] - 273.15, 1),
                "f": round((weather["temp"] - 273.15) * 9 / 5 + 32, 1),
                "k": round(weather["temp"], 1),
            },
            "feels_like": {
                "temp": {
                    "c": round(weather["feels_like"] - 273.15, 1),
                    "f": round((weather["feels_like"] - 273.15) * 9 / 5 + 32, 1),
                    "k": round(weather["feels_like"], 1),
                }
            },
            "pop": weather["pop"],
            "humidity": weather["humidity"],
            "weather_type": weather["weather"][0]["main"],
        }
        hours["hours"].append(hour)

    return hours, 200


app.run()
