from flask import Flask, render_template, request, Response, jsonify
from camera import Camera
from wtforms import Form, BooleanField, StringField, PasswordField, validators
import time
import json

app = Flask(__name__)

video_stream = Camera()

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


# @app.route('/loan', methods=['GET', 'POST'])
# def loan():
#     form = LoanForm(request.form)
#     if request.method == 'POST' and form.validate():
#         user = User(form.username.data, form.email.data,
#                     form.password.data)
#         db_session.add(user)
#         flash('Thanks for registering')
#         return redirect(url_for('login'))
#     return render_template('loan.html', form=form)

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


@app.route('/pong', methods=['GET', 'POST'])
def face():
    # TODO next: solve infinite loop problem...
    return render_template('headpong.html')


if __name__ == '__main__':
    # run with debug = False 
    app.run(host='127.0.0.1', debug=False, port="5000")
