import time
import json
from urllib import parse

from flask import Flask, render_template, request, Response, jsonify, redirect, url_for
from wtforms import Form, BooleanField, StringField, PasswordField, validators

from camera import Camera
from newsfeed import Feed
from pongutils import get_high_score, set_high_score
from mydatautils import get_user_data, set_user_data, parse_response
app = Flask(__name__)

# video_stream = Camera()

class LoanForm(Form):
    amount = StringField('Amount (max. 1m)', [validators.NumberRange(min=0, max=1000000)])
    country = StringField('Which country were you born in?', [validators.Length(min=6, max=35)])
    password = PasswordField('New Password', [
        validators.DataRequired(),
        validators.EqualTo('confirm', message='Passwords must match')
    ])
    confirm = PasswordField('Repeat Password')
    accept_tos = BooleanField('I accept the TOS', [validators.DataRequired()])


@app.route("/")
def start():
    return render_template('index.html')

@app.route("/newsfeed", methods=['GET', 'POST'])
def newsfeed():
    f = Feed()
    feed = json.loads(f.get_feed(N=3))
    print(feed)
    return render_template('facefeed.html', data=feed)


@app.route("/save_high_score", methods=["POST"])
def save_high_score():
    if request.method == 'POST':
        if request.highScore:
           highScore = int(request.highScore)
           questions.append({'highScore': highScore})
           set_high_score(highScore)

        highScore = get_high_score()

    return render_template('def.html', questions=questions)



data = json.loads(json.dumps({"timestamp": "12th March 2023",
                     "screenshot":  "img",
                     "service":  "www.newsfeed.com", 
                    "url": "djfjdfjdlkfs"})) # NB json.loads!!



@app.route("/report_external")
def report_external():
    return render_template('report-external.html')

@app.route("/explain")
def explain():
    pass

@app.route("/compare")
def compare():
    pass

@app.route("/user_data", methods=["GET", "POST"])
def user_data():
    if request.method == "POST":
        data = request.get_data().decode("utf-8")
    print(data)
    data = parse.unquote(data)
    data = parse_response(data)
    print(222, data)
    redir = data["redirect_url"].replace("/", "")
    del data["redirect_url"]
    return redirect(url_for(redir, data=data))


@app.route("/report_internal")
def report_internal():
    data = request.get_data()
    return render_template('report-internal.html', code=302, data=json.loads(json.dumps(data)))

@app.route("/my_data")
def my_data(data):
    data = request.get_data()
    return render_template('mydata.html', code=302, data=json.loads(json.dumps(data)))

def gen(camera):
    while True:
        ## read the camera frame
        frame = camera.get_frame()
        yield(b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        
def genpong(camera):
    while True:
        return json.dumps({"headPos": camera.get_x_coord()}).encode("utf-8")


@app.route('/video_feed')
def video_feed():
     # TODO get explain button data here
     return Response(gen(video_stream),
                    mimetype='multipart/x-mixed-replace; boundary=frame')



@app.route('/move_paddle', methods=['GET'])
def move_paddle():
    print(video_stream.get_x_coord())
    return Response(genpong(video_stream), mimetype="application/json")



@app.route('/update_high_score', methods=['POST'])
def updateHighScore():
    print(request)
    raise Exception()
    if request.method == 'POST':
        if request.highScore:
           highScore = int(request.highScore)
           set_high_score(highScore)


@app.route('/pong/', methods=["GET", "POST"])
def pong():
    highScore = get_high_score()
    data = {'highScore': highScore}
    return render_template('headpong.html', data=data)


if __name__ == '__main__':
    # run with debug = False 
    app.run(host='127.0.0.1', debug=False, port="5000")
