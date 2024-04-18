# ContestAI 

A demo platform to test out AI reoprting mechanisms using some AI apps with in-built bias

Current apps:
* Headpong - uses facial detection model, does not work for people wearing green clothes NB this bias is currently rules based for simulation purposes, not built into the ML model

#### Setup
tested on 
* Ubuntu 20.04 
* python10 N.B does NOT work with python12 (as of March 2024 due to lack of mediapipe support for python12)
* flask
* headpong requires a webcam

#### Install
```
git clone
cd contestAI
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
```

#### Notes
- Headpong requires flask to be run using python3 app.py instead of `flask run` due to specific env variables that have to be set, otherwise webcam access doesn't work



