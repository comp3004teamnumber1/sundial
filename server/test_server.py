import requests
import sys

session_key = ""
username = "naek"
password = "naek_password"


def post_register():
    register = requests.post(
        "http://127.0.0.1:5000/register",
        json={"username": username, "password": password},
    )
    return register.json()


def post_login():
    login = requests.post(
        "http://127.0.0.1:5000/login",
        json={"username": username, "password": password},
    )
    return login.json()


def get_hourly():
    hourly = requests.get(
        "http://127.0.0.1:5000/hourly?username={}&session_key={}".format(
            username, session_key
        )
    )
    return hourly.json()


def get_daily():
    daily = requests.get(
        "http://127.0.0.1:5000/daily?username={}&session_key={}".format(
            username, session_key
        )
    )
    return daily.json()


def test_register():
    assert post_register().get("status") == 200


def test_login():
    global session_key
    response = post_login()
    session_key = response["session_key"] if response["session_key"] else 0
    assert session_key != 0


def test_hourly():
    assert get_hourly().get("hours")


def test_daily():
    assert get_daily().get("days")