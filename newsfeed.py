import pandas as pd
from pathlib import Path
import numpy as np


IMG_FOLDER = Path("static/data/images")

def random_choice(df, N=3):
    choices = np.random.choice(df.index.values, size=N, replace=False)
    return choices


class Feed():
    def __init__(self):
        self.all_stories = pd.read_json("static/data/News_Category_Dataset_v3.json", nrows=100, lines=True)
        
        # validate image paths
        # print(len(self.all_stories), end="--img path validation-->")
        # self.all_stories["isvalidimgpath"] = self.all_stories["imgfilepath"].apply(lambda x: (IMG_FOLDER/x).exists())
        # self.all_stories = self.all_stories[self.all_stories["isvalidimgpath"]]
        # print(len(self.all_stories))

        self.all_stories["viewed"] = False

    
    def get_feed(self, N=3, algo=random_choice):
        unseen = self.all_stories[self.all_stories["viewed"] == False]
        choices = algo(unseen, N=N)
        self.all_stories[self.all_stories.isin(choices)]["viewed"] = True
        return self.all_stories[self.all_stories.index.isin(choices)].to_json(orient="records")

if __name__ == "__main__":
    f = Feed()
    print(f.get_feed(N=3))
    