import flask
import json
import requests
import config
import uuid
from datetime import datetime
import sqlite3
import os
from geopy.geocoders import Nominatim

from encryption import encrypt_password, check_encrypted_password

# flask setup
app = flask.Flask(__name__)
app.config["DEBUG"] = True


# sqlite3 setup
def init_db():
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute("""CREATE TABLE users (username text PRIMARY KEY, password text)""")
    c.execute(
        """CREATE TABLE tasks (id PRIMARY KEY, username text, task text, date integer, ideal_weather text, location text)"""
    )
    c.execute("""CREATE TABLE cached_locations (location text, lat text, lon text)""")
    conn.commit()
    conn.close()


# generate initial database
if not os.path.isfile("db.db"):
    init_db()

# global vars
config = config.Config()
sessions = {}


# authenticates if the user account exists
def authenticate_login(username, password):
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute("SELECT password FROM users WHERE username = '{}'".format(username))
    hashed_password = c.fetchone()[0]
    conn.close()
    return check_encrypted_password(password, hashed_password)


# checks to see if the user is logged in
def authenticate_route(headers):
    session_key = headers.get("session_key", default=None, type=str)
    # verify session key was sent
    return session_key in sessions


# turns a location into a latitude and longitude
def get_lat_long(location):
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute(
        "SELECT lat, lon FROM cached_locations WHERE location = '{}'".format(location)
    )
    query = c.fetchone()
    if not query:
        geolocation = Nominatim(user_agent="sundial").geocode(location)
        latlon = {"latitude": geolocation.latitude, "longitude": geolocation.longitude}
        c.execute(
            "INSERT INTO cached_locations (location, lat, lon) VALUES ('{}', '{}', '{}')".format(
                location, latlon.get("latitude"), latlon.get("longitude")
            )
        )
        conn.commit()
        conn.close()
        return latlon.get("latitude"), latlon.get("longitude")
    conn.close()
    return query[0], query[1]


def get_weather_data(location):
    latlon = get_lat_long(location)
    api_url = (
        "http://api.openweathermap.org/data/2.5/onecall?lat={}&lon={}&appid={}".format(
            latlon[0], latlon[1], config.OWM_API_KEY
        )
    )
    return requests.get(api_url)


@app.route("/", methods=["GET"])
def credits():
    return '<h1>Developed by <a href="https://naek.ca">NAEK</a></h1>'


# POST: /register
# DESC: registers the users account information
# PARAMS: username:str, password:str
# SENDS: JSON with status
@app.route("/register", methods=["POST"])
def register():
    post_args = flask.request.get_json()
    # verify that a username and password was sent
    if post_args["username"] and post_args["password"]:
        username = post_args.get("username")
        password = post_args.get("password")
    else:
        return {"status": 401, "error": "Username or password is missing."}, 401
    # authenticate the account
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute("SELECT username FROM users WHERE username = '{}'".format(username))
    if c.fetchone():
        if c.fetchone()[0] == username:
            return {"status": 401, "error": "That username is taken."}, 401
    c.execute(
        "INSERT INTO users (username, password) VALUES ('{}', '{}')".format(
            username, encrypt_password(password)
        )
    )
    conn.commit()
    conn.close()
    return {"status": 200}, 200


# POST: /login
# DESC: authenticates the users account information
# PARAMS: username:str, password:str
# SENDS: JSON with the session_key
@app.route("/login", methods=["POST"])
def login():
    session_key = uuid.uuid4()
    post_args = flask.request.get_json()
    # verify that a username and password was sent
    if post_args["username"] and post_args["password"]:
        username = post_args.get("username")
        password = post_args.get("password")
    else:
        return {"status": 401, "error": "Username or password is missing."}, 401
    # authenticate the account
    if authenticate_login(username, password):
        sessions.update({str(session_key): username})
        return {"status": 200, "session_key": session_key}, 200
    return {"status": 401, "error": "Incorrect password."}, 401


# GET: /daily
# DESC: gets the information related to the daily componenet
# PARAMS: username:str, session_key:str
# SENDS: JSON with 8 days of weather info
@app.route("/daily", methods=["GET"])
def daily():
    get_args = flask.request.args
    get_headers = flask.request.headers
    # verify that a username and session key was sent
    if not authenticate_route(get_headers):
        return {"status": 401, "error": "Missing session key."}, 401
    if not get_args["location"]:
        return {"status": 401, "error": "Missing location."}, 401
    api_return = get_weather_data(get_args.get("location"))
    # convert to json
    weather_data = api_return.json()
    days = {"days": []}
    # build the json
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
        days.get("days").append(day)
    # return the json
    days.update({"status": 200})
    return days, 200


# GET: /daily
# DESC: gets the information related to the hourly componenet
# PARAMS: username:str, session_key:str
# SENDS: JSON with 24 hours of weather info
@app.route("/hourly", methods=["GET"])
def hourly():
    get_args = flask.request.args
    get_headers = flask.request.headers
    # verify that a username and session key was sent
    if not authenticate_route(get_headers):
        return {"status": 401, "error": "Missing session key."}, 401
    if not get_args["location"]:
        return {"status": 401, "error": "Missing location."}, 401
    api_return = get_weather_data(get_args.get("location"))
    # convert to json
    weather_data = api_return.json()
    hours = {"hours": []}
    # build the json
    for weather in weather_data["hourly"]:
        if len(hours.get("hours")) > 23:
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
        hours.get("hours").append(hour)
    # return the json
    hours.update({"status": 200})
    return hours, 200


# (username text, task text, date text, ideal_weather text, location text)
@app.route("/task", methods=["POST"])
def create_task():
    post_args = flask.request.get_json()
    post_headers = flask.request.headers
    if not authenticate_route(post_headers):
        return {"status": 401, "error": "Missing session key."}, 401
    if (
        not post_args.get("task", 0)
        or not post_args.get("date", 0)
        or not post_args.get("ideal_weather", 0)
        or not post_args.get("location", 0)
    ):
        return {
            "status": 401,
            "error": "Missing required field. (task, date, ideal weather, or location)",
        }, 401
    task_id = str(uuid.uuid4())
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute(
        "INSERT INTO tasks (id, username, task, date, ideal_weather, location) VALUES ('{}', '{}', '{}', '{}', '{}', '{}')".format(
            task_id,
            sessions.get(post_headers.get("session_key")),
            post_args.get("task"),
            post_args.get("date"),
            post_args.get("ideal_weather"),
            post_args.get("location"),
        )
    )
    conn.commit()
    conn.close()
    return {"status": 200, "id": task_id}, 200


@app.route("/task/<task_id>", methods=["POST"])
def update_task(task_id):
    post_args = flask.request.get_json()
    post_headers = flask.request.headers
    if not authenticate_route(post_headers):
        return {"status": 401, "error": "Missing session key."}, 401
    if not task_id:
        return {"status": 401, "error": "Missing task id."}, 401
    if (
        not post_args.get("task", 0)
        or not post_args.get("date", 0)
        or not post_args.get("ideal_weather", 0)
        or not post_args.get("location", 0)
    ):
        return {
            "status": 401,
            "error": "Missing required field. (task, date, ideal weather, or location)",
        }, 401
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute("SELECT username FROM tasks WHERE id = '{}'".format(task_id))
    query = c.fetchone()
    if query:
        if query[0] != sessions.get(post_headers.get("session_key")):
            return {"status": 401, "error": "This task does not belong to you."}, 401
    c.execute(
        "UPDATE tasks SET task = '{}', date = '{}', ideal_weather = '{}', location = '{}' WHERE id = '{}'".format(
            post_args.get("task"),
            post_args.get("date"),
            post_args.get("ideal_weather"),
            post_args.get("location"),
            task_id,
        )
    )
    conn.commit()
    conn.close()
    return {"status": 200}, 200


@app.route("/task/<task_id>", methods=["DELETE"])
def delete_task(task_id):
    post_headers = flask.request.headers
    if not authenticate_route(post_headers):
        return {"status": 401, "error": "Missing session key."}, 401
    if not task_id:
        return {"status": 401, "error": "Missing task id."}, 401
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute("SELECT username FROM tasks WHERE id = '{}'".format(task_id))
    query = c.fetchone()
    if query:
        if query[0] != sessions.get(post_headers.get("session_key")):
            return {"status": 401, "error": "This task does not belong to you."}, 401
    c.execute("DELETE FROM tasks WHERE id = '{}'".format(task_id))
    conn.commit()
    conn.close()
    return {"status": 200}, 200


@app.route("/task", methods=["GET"])
def get_task():
    get_headers = flask.request.headers
    if not authenticate_route(get_headers):
        return {"status": 401}, 401
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute(
        "SELECT id, task, date, ideal_weather, location FROM tasks WHERE username = '{}'".format(
            sessions.get(get_headers.get("session_key"))
        )
    )
    return {"tasks": c.fetchall(), "status": 200}, 200


app.run()
