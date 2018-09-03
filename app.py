from tempfile import mkdtemp
import os
from flask import Flask, request, url_for, jsonify, abort
from flask_basicauth import BasicAuth
from flask_session import Session

import credentials
from validator import *
from helpers import *
import DB


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

@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

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

@basic_auth.required
@app.route("/dart", methods=["GET"])
def dart():
    if request.method == "GET":
        return render_template("darklord.html")

@app.route("/getjson", methods=["GET"])
def getjson():
    return jsonify({"secretCode":"jedi", "bugMessage":"This should not be here!"})

@app.route("/crime", methods=["GET", "POST"])
def crime():
    """
    very dirty method!
    :return: json
    """
    if request.method == "POST":
        req = request.get_json()
        if validate_request(req, schema_post_suspect):
            name = req["name"]
            gender = req["gender"]
            if gender == "female":
                DB.add_to_DB(name, gender)
                return jsonify({"success": "You added a new suspect"})
            else:
                raise InvalidUsage("error: only gender female is allowed", status_code=500)
        else:
            raise InvalidUsage("error: invalid post body", status_code=400)
    elif request.method == "GET":
        return jsonify({"crime": "The rabbit has been killed! Help find the killer of the rabbit!",
                        "suspects": DB.suspect})

@app.route("/crime/suspect/<int:id>", methods=["GET", "DELETE"])
def suspect(id):
    suspect_id = id - 1
    print(suspect_id)
    if request.method == "GET":
        try:
            suspect = DB.suspect[suspect_id]
            code = DB.code[suspect_id]
            return jsonify({**suspect, **code})
        except IndexError:
            raise InvalidUsage("error: not found suspect", status_code=404)
    elif request.method == "DELETE":
        try:
            del DB.suspect[suspect_id]
            return jsonify({f'delete': 'deleted ${id}'})
        except IndexError:
            raise InvalidUsage("error: not found suspect", status_code=404)

@app.route("/crime/ask_witness", methods=["GET", "POST"])
def alibi():
    if request.method == "GET":
        # return jsonify({"hi": "true"})
        raise InvalidUsage("The truth is unavailable", status_code=500)
    elif request.method == "POST":
        return jsonify({"success": "200 ok"})
    else:
        raise InvalidUsage("incorrect request", status_code=400)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True)
