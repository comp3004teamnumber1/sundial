import requests
import global_vars
from time import sleep
import requests
import argparse
from datetime import datetime
from helpers import get_weather_data
import sqlite3
import json

HOUR = 60 * 60


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
    task_suggestions = []
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
            task_suggestions.append(
                {
                    "date": datetime(
                        int(suggested_date[0]),
                        int(suggested_date[1]),
                        int(suggested_date[2]),
                        int(task_str_date[3]),
                        int(task_str_date[4]),
                    ).timestamp(),
                    "original": {
                        "id": task[0],
                        "task": task[1],
                        "date": task[2],
                        "location": task[3],
                        "ideal_weather": task[4],
                    },
                }
            )

    return {"suggestions": task_suggestions}


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
                if day.get("daily")[0].get("main") == notification_day[1]:
                    weather_matches.update(
                        {"day": date_of_notif, "weather": weather_data[1]}
                    )
                    break

    return weather_matches


def send_notification(username, data, expo, title, body):
    token = expo
    notification = {
        "to": token,
        "sound": "default",
        "title": title,
        "body": body,
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


while True:
    tokens = (
        requests.get(
            "{}/token".format(global_vars.config.HOST),
            headers={"Internal-Code": global_vars.config.INTERNAL_CODE},
        )
        .json()
        .get("tokens", {})
    )
    for user, token in tokens.items():
        weather_changes = check_task_weather_changes(user)
        day_notifications = check_day_notifications(user)
        if weather_changes.get("suggestions", []):
            print("Sending notification EVENT >> USER={} EXPO={}".format(user, token))
            notif = send_notification(
                user,
                weather_changes,
                token,
                "Event weather has changed!",
                "Tap here to view suggested dates.",
            )
            print(notif.content)
        if day_notifications:
            print("Sending notification DAY >> USER={} EXPO={}".format(user, token))
            notif = send_notification(
                user,
                day_notifications,
                token,
                "Your weather alert has triggered!",
                "Tap to open Sundial.",
            )
            print(notif.content)
    sleep(HOUR * 24)
