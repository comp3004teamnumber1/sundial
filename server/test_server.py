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
        "http://127.0.0.1:5000/hourly?location=Ottawa, Ontario",
        headers={"session_key": session_key},
    )
    return hourly.json()


def get_daily():
    daily = requests.get(
        "http://127.0.0.1:5000/daily?location=Ottawa, Ontario",
        headers={"session_key": session_key},
    )
    return daily.json()


def post_task_create():
    task = requests.post(
        "http://127.0.0.1:5000/task/create",
        json={
            "task": "test server",
            "date": 1603152293,
            "ideal_weather": "Sunny",
            "location": "Ottawa, Ontario",
        },
        headers={"session_key": session_key},
    )
    return task.json()


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


def test_task_create():
    assert post_task_create().get("id")