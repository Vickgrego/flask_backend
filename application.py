from tempfile import mkdtemp

from cs50.sql import SQL
from flask import Flask, redirect, render_template, request, session, url_for
from flask_basicauth import BasicAuth
from flask_session import Session
from passlib.apps import custom_app_context as pwd_context
from passlib.context import CryptContext

from helpers import *

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


@app.route("/buy", methods=["GET", "POST"])
@login_required
def buy():
    if request.method == "POST":
        msg_error = "Please, provide input"

        if not request.form.get("buy_stock") or not request.form.get("amount"):
            return render_template("buy.html", error = msg_error)

        #save input from form
        stock_symb = request.form.get("buy_stock")
        st_amount = request.form.get("amount")

        #check if amount is digit
        if not st_amount.isdigit():
            return render_template("buy.html", error = "amount should be positive integer")

        #check if user has enough cash
        #1 - get actual cash
        user_id = session.get("user_id")
        cash = db.execute("SELECT cash FROM users WHERE id=:id", id = user_id)
        #2 - check stock price
        stock_retrieved = lookup(stock_symb)

        if stock_retrieved is None:
            return apology("Counld not retrieve stock prices")

        stock_price = stock_retrieved["price"]

        sum = float(stock_price) * float(st_amount)
        #3 - compare cash and stock price
        cash_float = float(cash[0]["cash"])
        if cash_float < sum:
            return render_template("buy.html", error = "You have not enough money")

        #store a bought stocks in table "Archieve"
        #insert new or update if exist
        rows = db.execute("SELECT * FROM Archieve WHERE user_id=:user_id AND symbol=:symbol", symbol=stock_retrieved["symbol"], user_id=user_id)
        #if not exist then insert
        if len(rows) < 1:
            rows = db.execute("INSERT INTO Archieve (user_id, symbol, name, shares, price, total) \
                VALUES (:user_id, :symbol, :name, :shares, :price, :total)",
                    user_id = user_id, symbol = stock_retrieved["symbol"], name = stock_retrieved["name"],
                        shares = st_amount, price = stock_retrieved["price"], total = sum)
        #update if already exist
        else:
            rows = db.execute("UPDATE Archieve SET shares=shares+:shares, total=total+:total \
                WHERE user_id=:user_id AND symbol=:symbol",
                    user_id = user_id, symbol = stock_retrieved["symbol"], shares = st_amount, total = sum)

        if rows is None:
            return apology("Server's error")

        #update a cash in the users table
        result = db.execute("UPDATE users SET cash = :cash WHERE id = :id", cash = cash_float - sum, id = user_id)
        if result is None:
            return apology("Server's error")

        # redirect user to home page
        return redirect(url_for("index"))

    else:
        return render_template("buy.html")

@app.route("/history")
@login_required
def history():
    """Show history of transactions."""
    return apology("TODO")

@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in."""

    # forget any user_id
    session.clear()

    # if user reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username")
        # ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password")

        # query database for username
        rows = db.execute("SELECT * FROM users WHERE username = :username", username=request.form.get("username"))

        # ensure username exists and password is correct
        if len(rows) != 1 or not pwd_context.verify(request.form.get("password"), rows[0]["hash"]):
            return apology("invalid username and/or password")

        # remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # redirect user to home page
        return redirect(url_for("index"))

    # else if user reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")

@app.route("/logout")
def logout():
    """Log user out."""

    # forget any user_id
    session.clear()

    # redirect user to login form
    return redirect(url_for("login"))

@app.route("/quote", methods=["GET", "POST"])
@login_required
def quote():

    #for POST display result
    if request.method == "POST":
        #check if input not empty
        if not request.form.get("quote"):
            return apology("must provide a symbol")
        #save quote from from
        quote = request.form.get("quote")

        #use helper.lookup to retrieve stock
        stock_retrieved = lookup(quote)
        #check if stock is not None
        if stock_retrieved is None:
            return apology("Stock not found")
        #if success render a template with result
        return render_template("quote_display.html", name = stock_retrieved["name"], price = stock_retrieved["price"], symbol = stock_retrieved["symbol"])

    #for GET display form
    else:
        return render_template("quote.html")

@app.route("/register", methods=["GET", "POST"])
def register():

    session.clear()

    """Register user."""
    # if user reached route via POST
    if request.method == "POST":

        # ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username")

        # ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password")

        elif not request.form.get("confirm_pass"):
            print("not confirmed pass")
            return apology("must confirm password")

        login = request.form.get("username")
        password = request.form.get("password")
        confirm_pass = request.form.get("confirm_pass")

        if password != confirm_pass:
            return apology("password doesn't match confirm password")

        #hashing pass
        scheme_for_hash = CryptContext(schemes=["sha256_crypt"], sha256_crypt__default_rounds=77000)
        hash_of_pass = scheme_for_hash.hash(password)

        # insert into database new username
        rows = db.execute("INSERT INTO users (username, hash) VALUES (:username, :hash)", username=login, hash=hash_of_pass)
        if rows is None:
            return apology("such user is already registered", 409)

        return redirect(url_for("index"))

    else:
        return render_template("register.html")

@app.route("/sell", methods=["GET", "POST"])
@login_required
def sell():
    if request.method == "POST":

        #sell stock
        #1 - get stock_total
        symbol = request.form.get("symbol")
        user_id = session["user_id"]
        price_total = db.execute("SELECT total from user WHERE symbol=:symbol AND user_id=:user_id", symbol=symbol, user_id=user_id)

        #2 - updated users - add price to cash

        return redirect(url_for("index"))

    else:
        user_id = session["user_id"]
        symbols = db.execute("SELECT symbol FROM Archieve WHERE user_id=:user_id", user_id=user_id)
        return render_template("sell.html", symbols=symbols)

if __name__ == "__main__":
    app.run(debug=True, port=5000)

