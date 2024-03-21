
from pathlib import Path

HIGHSCOREFILE = Path("static/data/highscore.txt")

def get_high_score():
    with open(HIGHSCOREFILE) as f:
        return int(f.read())
    
def set_high_score(s):
    s = int(s)
    assert s > 0, f"high score: {s}"
    with open(HIGHSCOREFILE, "w") as f:
        f.write(str(s))

