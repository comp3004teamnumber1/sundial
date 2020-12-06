import requests
import sys

session_key = ""
task_id = ""
notification_day_id = ""
username = "naek"
password = "naek_password"
changed_password = "naek_pass"


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


def post_login_changed():
    login = requests.post(
        "http://127.0.0.1:5000/login",
        json={"username": username, "password": changed_password},
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
            "date": 1607129107,
            "ideal_weather": "Clear",
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
        "http://127.0.0.1:5000/task?date=2020-11-15&offset=-300",
        headers={"Session-Key": session_key},
    )
    return task.json()


def suggest_task():
    task = requests.get(
        "http://127.0.0.1:5000/taskSuggestion/naek",
        headers={"Session-Key": session_key},
    )
    return task.json()


def post_notification_day():
    notif = requests.post(
        "http://127.0.0.1:5000/notification/day",
        json={
            "date": 1605888000,
            "ideal_weather": "Clear",
            "location": "Ottawa, Ontario",
            "offset": "-300",
        },
        headers={"Session-Key": session_key},
    )
    return notif.json()


def get_notification_day():
    notif = requests.get(
        "http://127.0.0.1:5000/notification/day", headers={"Session-Key": session_key}
    )
    return notif.json()


def delete_notification_day():
    notif = requests.delete(
        "http://127.0.0.1:5000/notification/day/{}".format(notification_day_id),
        headers={"Session-Key": session_key},
    )
    return notif.json()


def post_password():
    response = requests.post(
        "http://127.0.0.1:5000/password",
        headers={"Session-Key": session_key},
        json={"old_password": password, "new_password": changed_password},
    )
    return response.json()


def post_settings():
    response = requests.post(
        "http://127.0.0.1:5000/settings",
        headers={"Session-Key": session_key},
        json={"settings": "{settings idk}"},
    )
    return response.json()


def test_register():
    assert post_register().get("status") == 200


def test_login():
    global session_key
    response = post_login()
    session_key = response.get("session_key", 0)
    assert session_key != 0


def test_hourly():
    response = get_hourly()
    assert response.get("hours")


def test_daily():
    response = get_daily()
    print(response)
    assert response.get("days")


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


def test_suggest_task():
    response = suggest_task()
    print(response)
    assert response.get("status") == 200


def test_delete_task():
    assert delete_task().get("status") == 200


def test_post_notification_day():
    global notification_day_id
    response = post_notification_day()
    notification_day_id = response.get("notification_day_id")
    assert notification_day_id != 0


def test_get_notification_day():
    response = get_notification_day()
    assert len(response.get("notification_days", [])) != 0


def test_delete_notification_day():
    response = delete_notification_day()
    assert response.get("status", 0) == 200


def test_post_password():
    response = post_password()
    assert response.get("status", 0) == 200


def test_post_settings():
    response = post_settings()
    assert response.get("status", 0) == 200


def test_changed_password():
    global session_key
    response = post_login_changed()
    session_key = response.get("session_key", 0)
    assert session_key != 0