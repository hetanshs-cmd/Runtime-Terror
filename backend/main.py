from flask import Flask

app = Flask(__name__)


@app.route("/", methods=["GET"])
def home():
    return "hello world"


if __name__ == "__main__":
    app.run(host='10.1.109.135', port=9501)
