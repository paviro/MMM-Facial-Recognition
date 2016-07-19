#!/usr/bin/python
# coding: utf8
"""MMM-Facial-Recognition - MagicMirror Module
Face Recognition script config
The MIT License (MIT)

Copyright (c) 2016 Paul-Vincent Roll (MIT License)
Based on work by Tony DiCola (Copyright 2013) (MIT License)
"""
import inspect
import os
import json
import sys
import platform


def to_node(type, message):
    print(json.dumps({type: message}))
    sys.stdout.flush()


_platform = platform.uname()[4]
path_to_file = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))

# Size (in pixels) to resize images for training and prediction.
# Don't change this unless you also change the size of the training images.
FACE_WIDTH = 92
FACE_HEIGHT = 112

# Face detection cascade classifier configuration.
# You don't need to modify this unless you know what you're doing.
# See: http://docs.opencv.org/modules/objdetect/doc/cascade_classification.html
HAAR_FACES = path_to_file + '/haarcascade_frontalface.xml'
HAAR_SCALE_FACTOR = 1.3
HAAR_MIN_NEIGHBORS = 4
HAAR_MIN_SIZE = (30, 30)

CONFIG = json.loads(sys.argv[1]);

def get(key):
    return CONFIG[key]

def get_camera():
    to_node("status", "-" * 20)
    try:
        if get("useUSBCam") == False:
            import picam
            to_node("status", "PiCam ausgewählt...")
            cam = picam.OpenCVCapture()
            cam.start()
            return cam
        else:
            raise Exception
    except Exception:
        import webcam
        to_node("status", "Webcam ausgewählt...")
        return webcam.OpenCVCapture(device_id=0)
    to_node("status", "-" * 20)
