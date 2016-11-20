"""Raspberry Pi Face Recognition Treasure Box
Webcam OpenCV Camera Capture Device
Copyright 2013 Tony DiCola

Webcam device capture class using OpenCV.  This class allows you to capture a
single image from the webcam, as if it were a snapshot camera.

This isn't used by the treasure box code out of the box, but is useful to have
if running the code on a PC where only a webcam is available.  The interface is
the same as the picam.py capture class so it can be used in the box.py code
without any changes.
"""
import threading
import time
import cv2

# Rate at which the webcam will be polled for new images.
CAPTURE_HZ = 30.0


class OpenCVCapture(object):
    def __init__(self, device_id=0):
        """Create an OpenCV capture object associated with the provided webcam
        device ID.
        """
        # Open the camera.
        self._camera = cv2.VideoCapture(device_id)
        # self._camera.set(3,160)
        #self._camera.set(4,120)
        if not self._camera.isOpened():
            self._camera.open()
        # Start a thread to continuously capture frames.
        # This must be done because different layers of buffering in the webcam
        # and OS drivers will cause you to retrieve old frames if they aren't
        # continuously read.
        self._capture_frame = None
        # Use a lock to prevent access concurrent access to the camera.
        self._capture_lock = threading.Lock()
        self._capture_thread = threading.Thread(target=self._grab_frames)
        self._capture_thread.daemon = True
        self._capture_thread.start()

    def _grab_frames(self):
        while True:
            retval, frame = self._camera.read()
            with self._capture_lock:
                self._capture_frame = None
                if retval:
                    self._capture_frame = frame
            time.sleep(1.0 / CAPTURE_HZ)

    def read(self):
        """Read a single frame from the camera and return the data as an OpenCV
        image (which is a numpy array).
        """
        frame = None
        with self._capture_lock:
            frame = self._capture_frame
        # If there are problems, keep retrying until an image can be read.
        while frame is None:
            time.sleep(0)
            with self._capture_lock:
                frame = self._capture_frame
        # Return the capture image data.
        return frame
        
    def stop(self):
        print '{"status":"Terminating..."}'
