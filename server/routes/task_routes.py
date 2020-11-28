from helpers import authenticate_route, build_insert_query, build_update_query
import global_vars
from __main__ import app

import re
from datetime import datetime
import sqlite3
import uuid
import flask


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
        "username": global_vars.sessions.get(post_headers.get("Session-Key")),
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
        if query[0] != global_vars.sessions.get(post_headers.get("Session-Key")):
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
        if query[0] != global_vars.sessions.get(post_headers.get("Session-Key")):
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
    offset = 0
    if get_args.get("offset", 0):
        offset_match = re.search(r"(\+|\-)(\d+)", get_args.get("offset"))
        if offset_match.groups():
            groups = offset_match.groups()
            if groups[0] == "+":
                offset = int(groups[1]) * 60
            else:
                offset = -1 * int(groups[1]) * 60
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute(
        "SELECT id, task, date, ideal_weather, location FROM tasks WHERE username = '{}'".format(
            global_vars.sessions.get(get_headers.get("Session-Key"))
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
                formatted_date = datetime.fromtimestamp(int(task[2]) + offset).strftime(
                    "%Y-%m-%d"
                )
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
