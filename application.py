from tempfile import mkdtemp

from cs50.sql import SQL
from flask import Flask, redirect, render_template, request, session, url_for, jsonify
from flask_basicauth import BasicAuth
from flask_session import Session
from passlib.apps import custom_app_context as pwd_context
from passlib.context import CryptContext

from helpers import *


ERROR = "I feel disturbance in force {}"

# configure application
app = Flask(__name__)

# ensure responses aren't cached
if app.config["DEBUG"]:
    @app.after_request
    def after_request(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Expires"] = 0
        response.headers["Pragma"] = "no-cache"
        return response

# custom filter
app.jinja_env.filters["usd"] = usd

# config BasicAuth
app.config["BASIC_AUTH_USERNAME"] = "IamQA"
app.config["BASIC_AUTH_PASSWORD"] = "QAPower"
basic_auth = BasicAuth(app)

# configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# configure CS50 Library to use SQLite database
db = SQL("sqlite:///finance.db")

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
        # query database for username
        rows = db.execute("SELECT * FROM users WHERE username = :username", username=request.form.get("username"))
        # ensure username exists and password is correct
        if len(rows) != 1 or not pwd_context.verify(request.form.get("password"), rows[0]["hash"]):
            return render_template("login.html", error=ERROR.format("Not valid credentials"))
        # remember which user has logged in
        session["user_id"] = rows[0]["id"]
        # redirect user to home page
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
@login_required
def step2():
    if request.method == "POST":
        return render_template("step2.html")
    else:
        return render_template("step2.html")

@basic_auth.required
@app.route("/step_breakpoints", methods=["GET", "POST"])
@login_required
def step_breakpoints():
    if request.method == "POST":
        return render_template("step3.html")
    else:
        return render_template("step3.html")

@basic_auth.required
@app.route("/step4", methods=["GET", "POST"])
@login_required
def step4():
    if request.method == "POST":
        if not request.form.get("password"):
            return render_template("step4.html", error=ERROR.format("Empty secret code"))
        secret_code = str(request.form.get("password"))
        if secret_code != "jedi":
            return render_template("step4.html", error=ERROR.format("Incorrect secret code"))
        elif secret_code == "jedi":
            return redirect(url_for("step_screencast"))
    else:
        return render_template("step4.html")

@basic_auth.required
@app.route("/step_screencast", methods=["GET", "POST"])
@login_required
def step_screencast():
    if request.method == "POST":
        if not request.form.get("password"):
            return render_template("step5.html", error=ERROR.format("Empty dark code"))
        secret_code = str(request.form.get("password"))
        if secret_code != "sith":
            return render_template("step5.html", error=ERROR.format("Incorrect dark code"))
        elif secret_code == "sith":
            return redirect(url_for("step_performance"))
    else:
        return render_template("step5.html")

@basic_auth.required
@app.route("/step_performance", methods=["GET", "POST"])
@login_required
def step_performance():
    if request.method == "POST":
        if not request.form.get("password"):
            return render_template("step6.html", error=ERROR.format("Empty secret lesson"))
        secret_code = str(request.form.get("password"))
        if secret_code != "star wars":
            return render_template("step6.html", error=ERROR.format("Incorrect secret lesson"))
        elif secret_code == "star wars":
            return redirect(url_for("step_console"))

    if request.method == "GET":
        return render_template("step6.html")

@basic_auth.required
@app.route("/step_console", methods=["GET"])
@login_required
def step_console():
    if request.method == "GET":
        return render_template("step7.html")

@basic_auth.required
@app.route("/step_advance", methods=["GET"])
@login_required
def step_advance():
    if request.method == "GET":
        return render_template("step_advance.html")

@login_required
@app.route("/getjson", methods=["GET"])
def getjson():
    return jsonify({"secretCode":"jedi", "bugMessage":"This should not be here!"})


@basic_auth.required
@app.route("/dartlord", methods=["GET", "POST"])
def dartlord():
    session.clear()
    if request.method == "POST":
        if not request.form.get("username"):
            return render_template("dartlord.html", error=ERROR.format("Username is empty"))
        elif not request.form.get("password"):
            return render_template("dartlord.html", error=ERROR.format("Password is empty"))
        elif not request.form.get("confirm_pass"):
            return render_template("dartlord.html", error=ERROR.format("Confirm is empty"))

        log_in = request.form.get("username")
        password = request.form.get("password")
        confirm_pass = request.form.get("confirm_pass")
        if password != confirm_pass:
            return render_template("dartlord.html", error=ERROR.format("password doesn't match confirm password"))
        #hashing pass
        scheme_for_hash = CryptContext(schemes=["sha256_crypt"], sha256_crypt__default_rounds=77000)
        hash_of_pass = scheme_for_hash.hash(password)
        # insert into database new username
        rows = db.execute("INSERT INTO users (username, hash) VALUES (:username, :hash)", username=log_in, hash=hash_of_pass)
        if rows is None:
            return apology("Such user is already registered", 409)

        return redirect(url_for("index"))
    else:
        return render_template("dartlord.html")


if __name__ == "__main__":
    app.run(port=5000)

