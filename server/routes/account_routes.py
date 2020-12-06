import global_vars
from helpers import (
    authenticate_login,
    authenticate_route,
    check_encrypted_password,
    encrypt_password,
)
from __main__ import app

import flask
import sqlite3
import uuid

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
    queried_user = c.fetchone()
    if queried_user:
        if queried_user[0] == username:
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
        global_vars.sessions.update({str(session_key): username})
        return {"status": 200, "session_key": session_key}, 200
    return {"status": 401, "error": "Incorrect password."}, 200


# saves a token to a user
@app.route("/token", methods=["POST"])
def add_token():
    post_args = flask.request.get_json()
    post_headers = flask.request.headers
    if not authenticate_route(post_headers):
        return {"status": 401, "error": "Missing session key."}, 200
    global_vars.tokens.update(
        {
            global_vars.sessions.get(post_headers.get("Session-Key")): post_args.get(
                "token"
            )
        }
    )
    return {"status": 200}, 200


# ! THIS MAY OR MAY NOT WORK, I'LL TEST LATER
@app.route("/password", methods=["POST"])
def change_password():
    post_args = flask.request.get_json()
    post_headers = flask.request.headers
    if not authenticate_route(post_headers):
        return {"status": 401, "error": "Missing session key."}, 200
    username = global_vars.sessions.get(post_headers.get("Session-Key"))
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute("SELECT password FROM users WHERE username = '{}'".format(username))

    old_password = post_args.get("old_password")
    old_hashed_password = c.fetchone()[0]
    new_password = post_args.get("new_password")

    if check_encrypted_password(old_password, old_hashed_password):
        c.execute(
            "UPDATE users SET password = '{}' WHERE username = '{}'".format(
                encrypt_password(new_password), username
            )
        )
        conn.commit()
        conn.close()
        return {"status": 200}, 200
    else:
        conn.commit()
        conn.close()
        return {
            "error": "Your password does not match your current password.",
            "status": 401,
        }, 200