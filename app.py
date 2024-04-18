import time
import json
from urllib import parse

from flask import Flask, render_template, request, Response, jsonify, redirect, url_for

from camera import Camera
from newsfeed import Feed
from pongutils import get_high_score, set_high_score
from mydatautils import get_user_data, set_user_data, parse_response
app = Flask(__name__)

video_stream = Camera()


@app.route("/")
def start():
    return render_template('index.html')

@app.route("/newsfeed", methods=['GET', 'POST'])
def newsfeed():
    f = Feed()
    feed = json.loads(f.get_feed(N=3))
    # print(feed)
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


@app.route("/compare")
def compare():
    pass

@app.route("/user_data", methods=["GET", "POST"])
def user_data():
    if request.method == "GET":
        data = dict(request.args)
        print(data)
        print(222, data)
        redir = data["redirect_url"].replace("/", "")
        del data["redirect_url"]

        return redirect(url_for(redir, messages=data), code=302)


@app.route("/report_internal", methods=["GET"])
def report_internal():
    # data = request.args["messages"]
    # return render_template('report-internal.html', data=json.loads(json.dumps(data)))
    return render_template('report-internal.html')


@app.route("/my_data", methods=["GET"])
def my_data():
    #data = request.args["messages"]
    print("my data", data) # my data b''
    #return render_template('my-data.html', data=json.loads(json.dumps(data)))
    return render_template('my-data.html')

def gen(camera, explain=False):
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

@app.route('/explain_feed')
def explain_feed():
     # TODO get explain button data here
     return Response(gen(video_stream, explain=True),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/explain/')
def explain():
    video_stream.explain_on()
    return render_template('explain.html')



@app.route('/move_paddle', methods=['GET'])
def move_paddle():
    # print(video_stream.get_x_coord())
    return Response(genpong(video_stream), mimetype="application/json")


@app.route('/update_high_score', methods=['POST'])
def updateHighScore():
    print(request)
    if request.method == 'POST':
        data = parse_response(request.get_data())
        print(data)
        highScore = int(data["highscore"])
        set_high_score(highScore)
        return {"message": "success"}, 200
    return {"message": "error"}, 303


@app.route('/pong/', methods=["GET", "POST"])
def pong():
    video_stream.explain_off()
    highScore = get_high_score()
    data = {'highScore': highScore}
    return render_template('headpong.html', data=data)


if __name__ == '__main__':
    # run with debug = False 
    app.run(host='127.0.0.1', debug=False, port="5000")
