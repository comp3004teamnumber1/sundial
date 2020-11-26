import requests
import sys

session_key = ""
task_id = ""
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
        "http://127.0.0.1:5000/hourly?location=Ottawa, Ontario&units=imperial",
        headers={"Session-Key": session_key},
    )
    return hourly.json()


def get_daily():
    daily = requests.get(
        "http://127.0.0.1:5000/daily?location=Ottawa, Ontario",
        headers={"Session-Key": session_key},
    )
    return daily.json()


def post_task_create():
    task = requests.post(
        "http://127.0.0.1:5000/task",
        json={
            "task": "Finish 3004.",
            "date": 1603152293,
            "ideal_weather": "Sunny",
            "location": "Ottawa, Ontario",
        },
        headers={"Session-Key": session_key},
    )
    return task.json()


def post_task_update():
    task = requests.post(
        "http://127.0.0.1:5000/task/{}".format(task_id),
        json={
            "task": "Read 3004 notes.",
            "date": 1604694000,
            "ideal_weather": "Rainy",
        },
        headers={"Session-Key": session_key},
    )
    return task.json()


def delete_task():
    task = requests.delete(
        "http://127.0.0.1:5000/task/{}".format(task_id),
        headers={"Session-Key": session_key},
    )
    return task.json()


def get_task():
    task = requests.get(
        "http://127.0.0.1:5000/task",
        headers={"Session-Key": session_key},
    )
    return task.json()

def get_consecutive_days():
    days = requests.get(
        "http://127.0.0.1:5000/consecutive?location=Ottawa&weather=Clouds&time=1",
        headers={"Session-Key": session_key},
    )
    return days.json()

def test_register():
    assert post_register().get("status") == 200


def test_login():
    global session_key
    response = post_login()
    session_key = response.get("session_key", 0)
    assert session_key != 0


def test_hourly():
    response = get_hourly()
    print(response)
    assert response.get("hours")


def test_daily():
    assert get_daily().get("days")


def test_task_create():
    global task_id
    response = post_task_create()
    task_id = response.get("id", 0)
    assert task_id != 0


def test_task_update():
    assert post_task_update().get("status") == 200


def test_get_task():
    response = get_task()
    print("\nGET: /task {}\n".format(response))
    assert response.get("status") == 200


def test_delete_task():
    assert delete_task().get("status") == 200

def test_consecutive_days():
    response = get_consecutive_days()
    print(response)
    assert response.get("status") == 200