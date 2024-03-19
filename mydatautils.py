
from pathlib import Path
import json

DATAFILE = Path("static/data/mydata.json")

def get_user_data():
    with open(DATAFILE) as f:
        return json.loads(f)
    
def set_user_data(s):
    with open(DATAFILE) as f:
        json.dumps(f)

def parse_response(s):
    print(s)
    ret = s.split("&")
    ret = dict([item.split("=") for item in ret])
    return ret