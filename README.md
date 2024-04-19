# ContestAI 

A demo platform based on Flask and mediapipe to test out AI reoprting mechanisms using some AI apps with in-built bias

Current apps:
* Headpong - uses facial detection model, does not work for people wearing green clothes NB this bias is currently rules based for simulation purposes, not built into the ML model

#### Setup
tested on 
* Ubuntu 20.04 
* python{8,10} - unsure if works with 9 or 11 but does NOT work with python12 (as of March 2024 due to lack of mediapipe support for python12)
* headpong requires a webcam

#### Install
```
git clone https://github.com/mprhode/contestAI.git
cd contestAI
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
```
visit localhost:5000 in browser

#### Notes
- Headpong requires flask to be run using python3 app.py instead of `flask run` due to specific env variables that have to be set, otherwise webcam access doesn't work
- Camera will time out after 100 (~16 minutes) of inactivity - just restart the app `python3 app.py` and reload the browser, alternatively change the timeout in base_camera.py line 101

#### Thanks
Thanks to the following projects
* https://github.com/crossphd/pong-js?tab=readme-ov-file


