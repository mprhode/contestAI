# from https://github.com/miguelgrinberg/flask-video-streaming/blob/master/camera_opencv.py

import os
import cv2
from base_camera import BaseCamera
from face_detection import FaceDetector

def track(img):
    tracker=cv2.TrackerKCF.create()

    bbox=cv2.selectROI("output",img,False)

    tracker.init(img ,bbox)

    success,bbox=tracker.update(img)

    if success:
        return draw(img,bbox)#we will write this UDF later
    else:
        return cv2.putText(img,"lost",(75,55),cv2.FONT_HERSHEY_SIMPLEX,0.7,(255,255,0),2)

def draw(img, bbox):
    x,y,w,h=int(bbox[0]),int(bbox[1]),int(bbox[2]),int(bbox[3])
    return cv2.rectangle(img,(x,y),((x+w),(y+h)),(0,255,255),3,1)


detective = FaceDetector()

class Camera(BaseCamera):
    video_source = 0

    def __init__(self):
        if os.environ.get('OPENCV_CAMERA_SOURCE'):
            Camera.set_video_source(int(os.environ['OPENCV_CAMERA_SOURCE']))
        super(Camera, self).__init__()

    @staticmethod
    def set_video_source(source):
        Camera.video_source = source

    @staticmethod
    def frames(explain=False):
        camera = cv2.VideoCapture(Camera.video_source)
        if not camera.isOpened():
            raise RuntimeError('Could not start camera.')
        
        while True:
            # read current frame
            _, img = camera.read()

            detective.detect(img, explain=explain)
            img = detective.get_image()

            # encode as a jpeg image and return it
            yield cv2.imencode('.jpg', img)[1].tobytes()

    @staticmethod
    def get_x_coord():
        return detective.main_face_x_coord


