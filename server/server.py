import flask
import json
import requests
import config
import uuid
from datetime import datetime, date, time
import sqlite3
import os
from geopy.geocoders import Nominatim
import argparse

from encryption import encrypt_password, check_encrypted_password

# argparse
parser = argparse.ArgumentParser(
    description="Flags for Sundial Backend: Developed by NAEK (https://naek.ca)"
)
parser.add_argument("--https", action="store_true")
args = parser.parse_args()

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
cached_weather_data = {}


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
    session_key = headers.get("Session-Key", default=None, type=str)
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


def get_weather_data(location, units="metric"):
    current_time = datetime.now().timestamp()
    if not cached_weather_data.get(location, 0):
        latlon = get_lat_long(location)
        api_url = "http://api.openweathermap.org/data/2.5/onecall?lat={}&lon={}&units={}&appid={}".format(
            latlon[0], latlon[1], units, config.OWM_API_KEY
        )
        cached_weather_data.update(
            {location: {"time": current_time, "data": requests.get(api_url)}}
        )
        return cached_weather_data.get(location).get("data")
    else:
        if current_time - cached_weather_data.get(location).get("time") > 3600:
            cached_weather_data.pop(location)
            return get_weather_data(location, units)
        else:
            return cached_weather_data.get(location).get("data")


def build_insert_query(table, params):
    query_string = "INSERT INTO {} ({}) VALUES ({})".format(
        table,
        ", ".join([col for col in params.keys() if params.get(col, 0)]),
        ", ".join(["'{}'".format(val) for val in params.values() if val]),
    )
    return query_string


def build_update_query(table, params, where):
    query_string = "UPDATE {} SET {} WHERE {}".format(
        table,
        ", ".join(["{} = '{}'".format(col, val) for col, val in params.items() if val]),
        where,
    )
    return query_string


def notification():
    return


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
        return {"status": 401, "error": "Username or password is missing."}, 200
    # authenticate the account
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute("SELECT username FROM users WHERE username = '{}'".format(username))
    if c.fetchone():
        if c.fetchone()[0] == username:
            return {"status": 401, "error": "That username is taken."}, 200
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
        return {"status": 401, "error": "Username or password is missing."}, 200
    # authenticate the account
    if authenticate_login(username, password):
        sessions.update({str(session_key): username})
        return {"status": 200, "session_key": session_key}, 200
    return {"status": 401, "error": "Incorrect password."}, 200


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
        }
        hours.get("hours").append(hour)
    # return the json
    hours.update({"status": 200})
    return hours, 200


# POST: /task
# DESC: creates a new task
# PARAMS: task:str, date:int, ideal_weather:str, location:str
# HEADERS: Session-Key
# SENDS: JSON with task id
@app.route("/task", methods=["POST"])
def create_task():
    post_args = flask.request.get_json()
    post_headers = flask.request.headers
    if not authenticate_route(post_headers):
        return {"status": 401, "error": "Missing session key."}, 200
    if not post_args.get("task", 0):
        return {
            "status": 401,
            "error": "Missing task.",
        }, 200
    task_id = str(uuid.uuid4())
    task = {
        "id": task_id,
        "username": sessions.get(post_headers.get("Session-Key")),
        "task": post_args.get("task", ""),
        "date": post_args.get("date", ""),
        "ideal_weather": post_args.get("ideal_weather", ""),
        "location": post_args.get("location", ""),
    }
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute(build_insert_query("tasks", task))
    conn.commit()
    conn.close()
    return {"status": 200, "id": task_id}, 200


# POST: /task/<task_id>
# DESC: updates a task
# PARAMS: task:str, date:int, ideal_weather:str, location:str
# HEADERS: Session-Key
# SENDS: JSON with status
@app.route("/task/<task_id>", methods=["POST"])
def update_task(task_id):
    post_args = flask.request.get_json()
    post_headers = flask.request.headers
    if not authenticate_route(post_headers):
        return {"status": 401, "error": "Missing session key."}, 200
    if not task_id:
        return {"status": 401, "error": "Missing task id."}, 200
    if (
        not post_args.get("task", 0)
        and not post_args.get("date")
        and not post_args.get("ideal_weather")
        and not post_args.get("location")
    ):
        return {"status": 401, "error": "All fields are empty."}, 200
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute("SELECT username FROM tasks WHERE id = '{}'".format(task_id))
    query = c.fetchone()
    if query:
        if query[0] != sessions.get(post_headers.get("Session-Key")):
            return {"status": 401, "error": "This task does not belong to you."}, 401
    task = {
        "task": post_args.get("task", ""),
        "date": post_args.get("date", ""),
        "ideal_weather": post_args.get("ideal_weather", ""),
        "location": post_args.get("location", ""),
    }
    c.execute(build_update_query("tasks", task, "id = '{}'".format(task_id)))
    conn.commit()
    conn.close()
    return {"status": 200}, 200


# POST: /task/<task_id>
# DESC: deletes a task
# HEADERS: Session-Key
# SENDS: JSON with status
@app.route("/task/<task_id>", methods=["DELETE"])
def delete_task(task_id):
    post_headers = flask.request.headers
    if not authenticate_route(post_headers):
        return {"status": 401, "error": "Missing session key."}, 200
    if not task_id:
        return {"status": 401, "error": "Missing task id."}, 200
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute("SELECT username FROM tasks WHERE id = '{}'".format(task_id))
    query = c.fetchone()
    if query:
        if query[0] != sessions.get(post_headers.get("Session-Key")):
            return {"status": 401, "error": "This task does not belong to you."}, 200
    c.execute("DELETE FROM tasks WHERE id = '{}'".format(task_id))
    conn.commit()
    conn.close()
    return {"status": 200}, 200


# GET: /task
# DESC: sends a list of all tasks of a user
# HEADERS: Session-Key
# SENDS: JSON with tasks
@app.route("/task", methods=["GET"])
def get_task():
    get_args = flask.request.args
    get_headers = flask.request.headers
    if not authenticate_route(get_headers):
        return {"status": 401, "error": "Missing session key."}, 200
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute(
        "SELECT id, task, date, ideal_weather, location FROM tasks WHERE username = '{}'".format(
            sessions.get(get_headers.get("Session-Key"))
        )
    )
    tasks = []
    if get_args.get("current", False):
        query = [
            list(row)
            for row in c.fetchall()
            if datetime.fromtimestamp(int(list(row)[2])) >= datetime.now()
        ]
    else:
        query = [list(row) for row in c.fetchall()]
    if query:
        for task in query:
            if get_args.get("date", 0):
                formatted_date = datetime.fromtimestamp(
                    int(task[2]) - (5 * 3600)
                ).strftime("%Y-%m-%d")
                if get_args.get("date") == formatted_date:
                    tasks.append(
                        {
                            "id": task[0],
                            "task": task[1],
                            "date": task[2],
                            "ideal_weather": task[3],
                            "location": task[4],
                        }
                    )
            else:
                tasks.append(
                    {
                        "id": task[0],
                        "task": task[1],
                        "date": task[2],
                        "ideal_weather": task[3],
                        "location": task[4],
                    }
                )

    return {
        "tasks": sorted(tasks, key=lambda task: task.get("date")),
        "status": 200,
    }, 200


if args.https:
    app.run(
        host="0.0.0.0",
        ssl_context=(
            "/etc/letsencrypt/live/sundial.vinhnguyen.ca/fullchain.pem",
            "/etc/letsencrypt/live/sundial.vinhnguyen.ca/privkey.pem",
        ),
    )
else:
    app.run()