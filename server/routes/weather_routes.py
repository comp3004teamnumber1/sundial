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

# GET: /consecutive
# DESC: sends a list of all tasks of a user
# PARAMS: location, weather, time
# HEADERS: Session-Key
# SENDS: JSON with starting day
@app.route("/consecutive", methods=["GET"])
def get_consecutive_days():
    get_args = flask.request.args
    get_headers = flask.request.headers
    if not authenticate_route(get_headers):
        return {"status": 401, "error": "Missing session key."}, 200
    if not get_args.get("location", 0):
        return {"status": 401, "error": "Missing location."}, 200
    if not get_args.get("ideal_weather", 0):
        return {"status": 401, "error": "Missing ideal weather."}, 200
    if not get_args.get("time", 0):
        return {"status": 401, "error": "Missing time."}, 200
    api_return = get_weather_data(
        get_args.get("location"), get_args.get("units", "metric")
    )
    days = {"days": []}
    # convert to json
    weather_data = api_return.json()
    if int(get_args.get("time")) <= 0 or not weather_data.get('daily'):
        return {"days": days, "status": 204}, 200
    weather_counter = 0
    last_day = -1
    for weatherIndex in range(len(weather_data["daily"])):
        weather_day = weather_data["daily"][weatherIndex]
        if weather_day.get("weather", [{}])[0].get("main", 0).lower() == get_args.get("ideal_weather", "").lower():
            weather_counter += 1
        else:
            weather_counter = 0
        if weather_counter == int(get_args.get("time")):
            last_day = weatherIndex
            break
    days = []
    if last_day == -1:
        return {"days": days, "status": 204}, 200
    weather_start = last_day-int(get_args.get("time"))
    for weather_index in range(int(get_args.get("time"))):
        weather = weather_data["daily"][weather_start + weather_index]
        day = {
            "date": weather.get("dt", 0),
            "temp": weather.get("temp", {}).get("day", 0),
            "feels_like_temp": weather.get("feels_like", {}).get("day", 0),
            "pop": weather.get("pop", 0),
            "wind_speed": weather.get("wind_speed", 0),
            "wind_deg": weather.get("wind_deg", 0),
            "humidity": weather.get("humidity", 0),
            "weather_type": weather.get("weather", [{}])[0].get("main", 0),
            "uvi": weather.get("uvi", -1)
        }
        days.append(day)
    return {"days": days, "start_date": days[0].get("date"), "status": 200}, 200