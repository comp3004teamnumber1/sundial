from helpers import authenticate_route, get_weather_data
import global_vars
from __main__ import app

from datetime import datetime
import sqlite3
import uuid
import flask


@app.route("/taskSuggestion/<username>")
def check_task_weather_changes(username):
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    curr_t = datetime.now().timestamp()

    def formatted_date(date):
        return datetime.fromtimestamp(int(date)).strftime("%Y-%m-%d-%H-%M")

    c.execute(
        "SELECT id, task, date, location, ideal_weather FROM tasks WHERE username = '{}' AND date > {} AND date < {}".format(
            username, curr_t, curr_t + (86400 * 15)
        )
    )
    tasks = c.fetchall()
    task_suggestions = {}
    for task in tasks:
        weather_data = get_weather_data(task[3]).json()
        task_str_date = formatted_date(task[2])
        found_task = False
        task_ok = False
        suggested_date = 0
        for day in weather_data.get("daily"):
            if (
                formatted_date(day.get("dt")).split("-")[:3]
                == task_str_date.split("-")[:3]
            ):
                found_task = True
                if task[4] == day["weather"][0]["main"]:
                    print(
                        "{} = {}".format(task[4], day["weather"][0]["main"]), flush=True
                    )
                    task_ok = True
                continue
            if task_ok:
                break
            if found_task:
                if day["weather"][0]["main"] == task[4]:
                    suggested_date = formatted_date(day.get("dt"))
                    break
        if suggested_date:
            suggested_date = suggested_date.split("-")
            task_str_date = task_str_date.split("-")
            task_suggestions.update(
                {
                    task[0]: datetime(
                        int(suggested_date[0]),
                        int(suggested_date[1]),
                        int(suggested_date[2]),
                        int(task_str_date[3]),
                        int(task_str_date[4]),
                    ).timestamp()
                }
            )

    return {"suggestions": task_suggestions, "status": 200}, 200


@app.route("/notification/day", methods=["POST"])
def post_day_notification():
    post_args = flask.request.get_json()
    post_headers = flask.request.headers

    if not authenticate_route(post_headers):
        return {"status": 401, "error": "Missing session key."}, 200

    if not post_args.get("date", 0):
        return {"status": 401, "error": "Missing date."}, 200

    if not post_args.get("ideal_weather", 0):
        return {"status": 401, "error": "Missing ideal weather."}, 200

    if not post_args.get("location", 0):
        return {"status": 401, "error": "Missing location."}, 200

    if not post_args.get("offset", 0):
        return {"status": 401, "error": "Missing offset."}, 200

    notification_day_id = uuid.uuid4()

    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute(
        """INSERT INTO notification_days (id, date, ideal_weather, location, offset, username) VALUES ('{}', '{}', '{}', '{}', '{}', '{}')""".format(
            notification_day_id,
            post_args.get("date"),
            post_args.get("ideal_weather"),
            post_args.get("location"),
            post_args.get("offset"),
            global_vars.sessions.get(post_headers.get("Session-Key")),
        )
    )
    conn.commit()
    conn.close()

    return {"notification_day_id": notification_day_id, "status": 200}, 200


@app.route("/notification/day/<notification_day_id>", methods=["DELETE"])
def delete_day_notification(notification_day_id):
    post_headers = flask.request.headers

    if not authenticate_route(post_headers):
        return {"status": 401, "error": "Missing session key."}, 200

    if not notification_day_id:
        return {"status": 401, "error": "Missing notification day id."}, 200

    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute(
        """DELETE FROM notification_days WHERE id = '{}'""".format(
            notification_day_id,
        )
    )
    conn.commit()
    conn.close()

    return {"status": 200}, 200


@app.route("/notification/day", methods=["GET"])
def get_day_notification():
    get_headers = flask.request.headers

    if not authenticate_route(get_headers):
        return {"status": 401, "error": "Missing session key."}, 200

    username = global_vars.sessions.get(get_headers.get("Session-Key"))

    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute(
        """SELECT id, date, ideal_weather, location FROM notification_days WHERE username = '{}'""".format(
            username
        )
    )
    notification_days = c.fetchall()
    conn.close()

    users_notification_days = []

    for notification_day in notification_days:
        users_notification_day = {
            "id": notification_day[0],
            "date": notification_day[1],
            "ideal_weather": notification_day[2],
            "location": notification_day[3],
        }
        users_notification_days.append(users_notification_day)

    return {"notification_days": users_notification_days, "status": 200}, 200
