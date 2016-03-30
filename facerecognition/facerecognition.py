#!/usr/bin/python
# coding: utf8

import os, os.path
import sys
import json
import time
import face
import cv2
import config
import syslog

def to_node(type, message):
	print(json.dumps({type: message}))
	sys.stdout.flush()
	
to_node("status", "Facerecognition started...")

current_user = None
last_match = None
active = True
angemeldet = 0
gleicher_nutzer_in_folge = 0	

	
# Load training data into model
to_node("status", 'Loading training data...')

if json.loads(sys.argv[1])["RECOGNITION_ALGORITHM"] == 1:
	to_node("status", "ALGORITHM: LBPH")
	model = cv2.createLBPHFaceRecognizer(threshold=config.POSITIVE_THRESHOLD)
elif json.loads(sys.argv[1])["RECOGNITION_ALGORITHM"] == 2:
	to_node("status", "ALGORITHM: Fisher")
	model = cv2.createFisherFaceRecognizer(threshold=config.POSITIVE_THRESHOLD)
else:
	to_node("status", "ALGORITHM: Eigen")
	model = cv2.createEigenFaceRecognizer(threshold=config.POSITIVE_THRESHOLD)

model.load(json.loads(sys.argv[1])["TRAINING_FILE"])
to_node("status", 'Training data loaded!')

camera = config.get_camera()

while True:
		time.sleep(json.loads(sys.argv[1])["INTERVAL"])
		if active == True:
			# Get image
			image = camera.read()
			# Convert image to grayscale.
			image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
			# Get coordinates of single face in captured image.
			result = face.detect_single(image)
			if result is None:
				if (time.time() - angemeldet > 15 and current_user != None):
					to_node("logout", {"user": current_user})
					gleicher_nutzer_in_folge = 0
					current_user = None
				continue
			x, y, w, h = result
			# Crop and resize image face.
			if config.RECOGNITION_ALGORITHM == 1:
				crop = face.crop(image, x, y, w, h)
			else:
				crop = face.resize(face.crop(image, x, y, w, h))
			# Test face against model.
			label, confidence = model.predict(crop)
			if (label !=-1 and label!=0):
				angemeldet = time.time()
				#Routine, zum Zählen, wie oft der selbe Nutzer in Folge erkannt wurde.
				if (label == last_match and gleicher_nutzer_in_folge < 2):
					gleicher_nutzer_in_folge = gleicher_nutzer_in_folge + 1
				if label != last_match:
					gleicher_nutzer_in_folge = 0
				#Nutzer wird nur gewechselt, wenn mindestens zweimal der gleiche, neue Nutzer hintereinander erkannt wurde.	
				if (label != current_user and gleicher_nutzer_in_folge > 1):
					current_user = label
					#Momentaner benutzer wird zu nodejs geschickt.
					to_node("login", {"user": label, "confidence": str(confidence)})
				last_match = label
			elif (current_user != "unknown" and time.time() - angemeldet > 5):
				current_user = "unknown"
				to_node("login", {"user": current_user, "confidence": None})
			else:
				continue