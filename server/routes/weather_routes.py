from helpers import authenticate_route, get_weather_data
from __main__ import app

import flask

# GET: /daily
# DESC: gets the information related to the daily componenet
# PARAMS: location
# HEADERS: Session-Key
# SENDS: JSON with 8 days of weather info
@app.route("/daily", methods=["GET"])
def daily():
    get_args = flask.request.args
    get_headers = flask.request.headers
    # verify that a username and session key was sent
    if not authenticate_route(get_headers):
        return {"status": 401, "error": "Missing session key."}, 200
    if not get_args["location"]:
        return {"status": 401, "error": "Missing location."}, 200
    api_return = get_weather_data(
        get_args.get("location"), get_args.get("units", "metric")
    )
    # convert to json
    weather_data = api_return.json()
    days = {"days": []}
    # build the json
    for weather in weather_data["daily"]:
        day = {
            "date": weather["dt"],
            "temp": weather["temp"]["day"],
            "feels_like_temp": weather["feels_like"]["day"],
            "pop": weather["pop"],
            "wind_speed": weather["wind_speed"],
            "wind_deg": weather["wind_deg"],
            "humidity": weather["humidity"],
            "weather_type": weather["weather"][0]["main"],
            "uvi": weather.get("uvi", 0),
        }
        days.get("days").append(day)
    # return the json
    days.update({"status": 200})
    return days, 200


# GET: /hourly
# DESC: gets the information related to the hourly component
# PARAMS: location
# HEADERS: Session-Key
# SENDS: JSON with 24 hours of weather info
@app.route("/hourly", methods=["GET"])
def hourly():
    get_args = flask.request.args
    get_headers = flask.request.headers
    # verify that a username and session key was sent
    if not authenticate_route(get_headers):
        return {"status": 401, "error": "Missing session key."}, 200
    if not get_args["location"]:
        return {"status": 401, "error": "Missing location."}, 200
    api_return = get_weather_data(
        get_args.get("location"), get_args.get("units", "metric")
    )
    # convert to json
    weather_data = api_return.json()
    hours = {"hours": []}
    # build the json
    for weather in weather_data["hourly"]:
        if len(hours.get("hours")) > 23:
            break
        hour = {
            "date": weather["dt"],
            "temp": weather["temp"],
            "feels_like_temp": weather["feels_like"],
            "pop": weather["pop"],
            "wind_speed": weather["wind_speed"],
            "wind_deg": weather["wind_deg"],
            "humidity": weather["humidity"],
            "weather_type": weather["weather"][0]["main"],
            "uvi": weather_data["daily"][0].get("uvi", 0),
        }
        hours.get("hours").append(hour)
    # return the json
    hours.update({"status": 200})
    return hours, 200