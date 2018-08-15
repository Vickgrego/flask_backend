from tempfile import mkdtemp
import os
from flask import Flask, request, url_for, jsonify
from flask_basicauth import BasicAuth
from flask_session import Session

import credentials
from helpers import *


ERROR = "I feel disturbance in force {}"

# configure application
app = Flask(__name__)

# custom filter
app.jinja_env.filters["usd"] = usd

# config BasicAuth
app.config["BASIC_AUTH_USERNAME"] = credentials.basic_auth_name
app.config["BASIC_AUTH_PASSWORD"] = credentials.basic_auth_pass
basic_auth = BasicAuth(app)

# configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.route("/")
@basic_auth.required
def index():
    return render_template("index.html")

@basic_auth.required
@app.route("/login", methods=["GET", "POST"])
def login():
    # forget any user_id
    session.clear()
    if request.method == "POST":
        # ensure username was submitted
        if not request.form.get("username"):
            return render_template("login.html", error=ERROR.format("Empty username"))
        # ensure password was submitted
        elif not request.form.get("password"):
            return render_template("login.html", error=ERROR.format("Empty password"))
        _login = str(request.form.get("username"))
        _pasw = str(request.form.get("password"))
        if _login != credentials.login or _pasw != credentials.passw:
            return render_template("login.html", error=ERROR.format("Credentials incorrect"))
        session["user_id"] = "01{}{}".format(_login, _pasw)
        return redirect(url_for("step2"))
    else:
        return render_template("login.html")

@basic_auth.required
@app.route("/logout")
def logout():
    # forget any user_id
    session.clear()
    # redirect user to login form
    return redirect(url_for("login"))

@basic_auth.required
@app.route("/step2", methods=["GET", "POST"])
def step2():
    if request.method == "POST":
        return render_template("step2.html")
    else:
        return render_template("step2.html")

@basic_auth.required
@app.route("/step_breakpoints", methods=["GET", "POST"])
def step_breakpoints():
    if request.method == "POST":
        return render_template("step3.html")
    else:
        return render_template("step3.html")

@basic_auth.required
@app.route("/step4", methods=["GET", "POST"])
def step4():
    if request.method == "POST":
        if not request.form.get("password"):
            return render_template("step4.html", error=ERROR.format("Empty secret code"))
        secret_code = str(request.form.get("password"))
        if secret_code != credentials.secret_code:
            return render_template("step4.html", error=ERROR.format("Incorrect secret code"))
        elif secret_code == credentials.secret_code:
            return redirect(url_for("step_screencast"))
    else:
        return render_template("step4.html")

@basic_auth.required
@app.route("/step_screencast", methods=["GET", "POST"])
def step_screencast():
    if request.method == "POST":
        if not request.form.get("password"):
            return render_template("step5.html", error=ERROR.format("Empty dark code"))
        code = str(request.form.get("password"))
        if code != credentials.dark_code:
            return render_template("step5.html", error=ERROR.format("Incorrect dark code"))
        elif code == credentials.dark_code:
            return redirect(url_for("step_performance"))
    else:
        return render_template("step5.html")

@basic_auth.required
@app.route("/step_performance", methods=["GET", "POST"])
def step_performance():
    if request.method == "POST":
        if not request.form.get("password"):
            return render_template("step6.html", error=ERROR.format("Empty secret lesson"))
        secret_code = str(request.form.get("password"))
        if secret_code != credentials.performance_code:
            return render_template("step6.html", error=ERROR.format("Incorrect secret lesson"))
        elif secret_code == credentials.performance_code:
            return redirect(url_for("step_console"))

    if request.method == "GET":
        return render_template("step6.html")

@basic_auth.required
@app.route("/step_console", methods=["GET"])
def step_console():
    if request.method == "GET":
        return render_template("step7.html")

@basic_auth.required
@app.route("/step_advance", methods=["GET"])
def step_advance():
    if request.method == "GET":
        return render_template("step_advance.html")

@app.route("/getjson", methods=["GET"])
def getjson():
    return jsonify({"secretCode":"jedi", "bugMessage":"This should not be here!"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run()
