import flask
import argparse
import os

from helpers import init_db
import global_vars
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


# generate initial database
if not os.path.isfile("db.db"):
    init_db()

import routes.index_route
import routes.task_routes
import routes.account_routes
import routes.weather_routes
import routes.notification_routes

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
