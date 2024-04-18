# from https://colab.research.google.com/github/googlesamples/mediapipe/blob/main/examples/face_detector/python/face_detector.ipynb#scrollTo=Yl_Oiye4mUuo
from typing import Tuple, Union
import math
import cv2
import numpy as np
# from google.colab.patches import cv2_imshow
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

MARGIN = 10  # pixels
ROW_SIZE = 10  # pixels
FONT_SIZE = 1
FONT_THICKNESS = 1
TEXT_COLOR = (255, 0, 0)  # red

# Checks if the float value is between 0 and 1.
def is_valid_normalized_value(value: float) -> bool:
            return (value > 0 or math.isclose(0, value)) and (value < 1 or
                                                            math.isclose(1, value))

class FaceDetector():
    def __init__(self):
        base_options = python.BaseOptions(model_asset_path='blaze_face_short_range.tflite') # set model name here
        options = vision.FaceDetectorOptions(base_options=base_options)
        self.detector = vision.FaceDetector.create_from_options(options)
        self.main_face_detection = None
        self.main_face_x_coord = None

    
    def _normalized_to_pixel_coordinates(self,
        normalized_x: float, normalized_y: float, image_width: int,
        image_height: int) -> Union[None, Tuple[int, int]]:
        """Converts normalized value pair to pixel coordinates."""

        if not (is_valid_normalized_value(normalized_x) and
                is_valid_normalized_value(normalized_y)):
            # TODO: Draw coordinates even if it's outside of the image bounds.
            return None
        x_px = min(math.floor(normalized_x * image_width), image_width - 1)
        y_px = min(math.floor(normalized_y * image_height), image_height - 1)
        return x_px, y_px


    def visualize(self,
            image,
            detection_result
        ) -> np.ndarray:
        """Draws bounding boxes and keypoints on the input image and return it.
        Args:
            image: The input RGB image.
            detection_result: The list of all "Detection" entities to be visualize.
        Returns:
            Image with bounding boxes.
        """
        annotated_image = image.copy()
        # height, width, _ = image.shape

        if not(self.main_face_detection is None):
            bb = self.main_face_detection.bounding_box
            x, y, w, h = bb.origin_x, bb.origin_y, bb.width, bb.height
            # face = img[bb.origin_x:bb.origin_x+bb.width, bb.origin_y:bb.origin_y+bb.height]
            ## detect top debug
            # cv2.imwrite("tshirt.jpg", tshirt)
            cv2.rectangle(annotated_image, (x,y), (x+w,y+h), TEXT_COLOR, 3)



        # # TODO only take biggest box size as detection...
        # for detection in detection_result.detections:
        #     # Draw bounding_box
        #     bbox = detection.bounding_box
        #     start_point = bbox.origin_x, bbox.origin_y
        #     end_point = bbox.origin_x + bbox.width, bbox.origin_y + bbox.height

        #     cv2.rectangle(annotated_image, start_point, end_point, TEXT_COLOR, 3)

            # Draw Loc of head
            # keypoint_px = self._normalized_to_pixel_coordinates(self.main_face_x_coord, 
            #                                                     self.main_face_detection.bounding_box.origin_y,
            #                                                     width, height)
            # color, thickness, radius = (0, 255, 0), 2, 2
            # circle_xy = (bbox.origin_x, bbox.origin_y)
            # cv2.circle(annotated_image, circle_xy, thickness, color, radius)

            # Draw label and score
            # category = detection.categories[0]
            # category_name = category.category_name
            # category_name = '' if category_name is None else category_name
            # probability = round(category.score, 2)
            # result_text = category_name + ' (' + str(probability) + ')'
            # text_location = (MARGIN + bbox.origin_x,
            #                 MARGIN + ROW_SIZE + bbox.origin_y)
            # cv2.putText(annotated_image, result_text, text_location, cv2.FONT_HERSHEY_PLAIN,
            #             FONT_SIZE, TEXT_COLOR, FONT_THICKNESS)

        return annotated_image #cv2.cvtColor(annotated_image, cv2.COLOR_BGR2RGB)
    
    def __get_relative_x(self, img, x):
        height, width, _ = img.shape
        return x / width

    def detect(self, img, explain=True):
        # Detect faces in the input image.
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img) # MR edit

        detection_result = self.detector.detect(mp_image)

        self.main_face_detection = None
        self.main_face_size = None
        anyone_green = False
        # Process the detection result. Find the biggest box
        for detection in detection_result.detections:
            # Get biggest box
            bbox = detection.bounding_box

            size = bbox.width * bbox.height
            if (self.main_face_detection is None) or (size > self.main_face_size):
                someone_in_green = self.detect_color(img, detection)
                if someone_in_green: 
                    anyone_green = True
                    # self.main_face_x_coord = None
                else:
                    self.main_face_detection = detection
                    self.main_face_size = size

        if self.main_face_detection:        
            # main face only
            main_face_bbox = self.main_face_detection.bounding_box
            self.main_face_x_coord = self.__get_relative_x(img, main_face_bbox.origin_x + main_face_bbox.width/2)
        self.current_image = img

        # EXPLANATION 
        if explain:
            self.current_image = self.visualize(img, detection_result)

        return anyone_green

    def get_image(self):
        return self.current_image
    
    def get_x_coord(self):
        return self.main_face_x_coord
    
    def detect_color(self, img, detection):
        has_green = False

        bb = detection.bounding_box
        x, y, w, h = bb.origin_x, bb.origin_y, bb.width, bb.height
        # face = img[bb.origin_x:bb.origin_x+bb.width, bb.origin_y:bb.origin_y+bb.height]
        x1, y1, x2, y2 = x-int(0.5*w), y+h, x+int(w*1.5), y+2*h
        tshirt = img[y1:y2, x1:x2]
        ## detect top debug
        # cv2.imwrite("tshirt.jpg", tshirt)
        # cv2.rectangle(img, (x1,y1), (x2,y2), TEXT_COLOR, 3)
        ## detect green
        ## Convert to HSV
        try:
            hsv = cv2.cvtColor(tshirt, cv2.COLOR_BGR2HSV)

            ## Mask of green (36,25,25) ~ (86, 255,255)
            # mask = cv2.inRange(hsv, (36, 25, 25), (86, 255,255))
            mask = cv2.inRange(hsv, (36, 25, 25), (90, 255,255))

            ## Slice the green
            imask = mask>0
            has_green = imask.sum() / imask.size > 0.1 # more than one quarter is green
            # ## debug_green
            # if has_green:
            #     print(imask.sum() / imask.size > 0.25)
            #     green = np.zeros_like(tshirt, np.uint8)
            #     green[imask] = tshirt[imask]

            #     ## Save 
            #     cv2.imwrite("green.png", green)
        except cv2.error:
            pass #TODO error fix needed 
        return has_green

    


if __name__ == "__main__":
    pass
