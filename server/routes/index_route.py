from __main__ import app


@app.route("/", methods=["GET"])
def credits():
    return '<h1>Developed by <a href="https://naek.ca">NAEK</a></h1>'