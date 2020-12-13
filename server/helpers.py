import global_vars

from datetime import datetime
import sqlite3
from passlib.context import CryptContext
from geopy.geocoders import Nominatim
import json
import requests

# encryption setup
pwd_context = CryptContext(
    schemes=["sha256_crypt"],
)

# encrypts the password
def encrypt_password(password):
    return pwd_context.hash(password)


# checks if the password matches the hash
def check_encrypted_password(password, hashed):
    return pwd_context.verify(password, hashed)


# sqlite3 setup
def init_db():
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute(
        """CREATE TABLE users (username text PRIMARY KEY, password text, settings blob)"""
    )
    c.execute(
        """CREATE TABLE tasks (id PRIMARY KEY, username text, task text, date integer, ideal_weather text, location text)"""
    )
    c.execute("""CREATE TABLE cached_locations (location text, lat text, lon text)""")
    c.execute(
        """CREATE TABLE notification_days (id text, date int, ideal_weather text, location text, offset text, username text)"""
    )
    conn.commit()
    conn.close()


# authenticates if the user account exists
def authenticate_login(username, password):
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute("SELECT password FROM users WHERE username = '{}'".format(username))
    try:
        hashed_password = c.fetchone()[0]
    except:
        conn.close()
        return False
    conn.close()
    return check_encrypted_password(password, hashed_password)


# checks to see if the user is logged in
def authenticate_route(headers):
    session_key = headers.get("Session-Key", default=None, type=str)
    # verify session key was sent
    return session_key in global_vars.sessions


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
        if not geolocation:
            latlon = {"latitude": 0, "longitude": 0}
        else:
            latlon = {
                "latitude": geolocation.latitude,
                "longitude": geolocation.longitude,
            }
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
    units = units.lower()
    if not global_vars.cached_weather_data.get(units, {}).get(location, {}):
        latlon = get_lat_long(location)
        api_url = "http://api.openweathermap.org/data/2.5/onecall?lat={}&lon={}&units={}&appid={}".format(
            latlon[0], latlon[1], units, global_vars.config.OWM_API_KEY
        )
        global_vars.cached_weather_data.get(units).update(
            {location: {"time": current_time, "data": requests.get(api_url)}}
        )
        return global_vars.cached_weather_data.get(units).get(location).get("data")
    else:
        if (
            current_time
            - global_vars.cached_weather_data.get(units).get(location).get("time")
            > 3600
        ):
            global_vars.cached_weather_data.get(units).pop(location)
            return get_weather_data(location, units)
        else:
            return global_vars.cached_weather_data.get(units).get(location).get("data")


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


def check_day_notifications(username):
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute(
        """SELECT date, ideal_weather, location FROM notification_days WHERE username = '{}'""".format(
            username
        )
    )

    notification_days = c.fetchall()
    if not notification_days:
        return -1

    weather_matches = {}

    for notification_day in notification_days:
        weather_data = get_weather_data(notification_day[2])
        date_of_notif = datetime.fromtimestamp(notification_day[0]).strftime("%Y-%m-%d")

        for day in weather_data:
            date_of_day = datetime.fromtimestamp(day).strftime("%Y-%m-%d")
            if date_of_day == date_of_notif:
                if day.get("daily")[0].get("main") == weather_data[1]:
                    weather_matches.update(
                        {"day": date_of_notif, "weather": weather_data[1]}
                    )
                    continue

    return weather_matches


# ! THIS MAY OR MAY NOT WORK, I'LL TEST LATER
def send_notification(username, data, expo=False):
    # token = "ExponentPushToken[n63_cAKPSVK1btgwRLLeCv]"
    token = expo
    if not expo:
        token = global_vars.tokens.get("username")
    notification = {
        "to": token,
        "sound": "default",
        "title": "Event weather has changed.",
        "body": "Event weather has changed!",
        "data": data,
    }
    push = requests.post(
        "https://exp.host/--/api/v2/push/send",
        data=json.dumps(notification),
        headers={
            "Accept": "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
        },
    )
    return push


def retrieve_settings(username):
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute("SELECT settings FROM users WHERE username = '{}'".format(username))
    settings = c.fetchone()
    conn.close()
    if settings:
        return settings[0]
    else:
        return ""


def save_settings(username, settings):
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute(
        "UPDATE users SET settings = '{}' WHERE username = '{}'".format(
            settings, username
        )
    )
    conn.commit()
    conn.close()
    return 0