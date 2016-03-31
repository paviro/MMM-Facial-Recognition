# MMM-Facial-Recognition
This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). It provides facial recognition and module swaping based on the current user.

## Usage
To train the needed model use the [MMM-Facial-Recognition-Tools](https://github.com/paviro/MMM-Facial-Recognition-Tools).

The entry in config.js can look like the following. (NOTE: You only have to add a variables if want to change its standard value.)

```
{
	module: 'MMM-Facial-Recognition',
	position: 'top_left',
	config: {
		// 1=LBPH | 2=Fisher | 3=Eigen
		RECOGNITION_ALGORITHM: 1,
		// Threshold for the confidence of a recognized face before it's considered a
		// positive match.  Confidence values below this threshold will be considered
		// a positive match because the lower the confidence value, or distance, the
		// more confident the algorithm is that the face was correctly detected.
		LBPH_THRESHOLD: 50,
		FISHER_THRESHOLD: 250,
		EIGEN_THRESHOLD: 3000,
		// Path to your training xml
		TRAINING_FILE: 'modules/MMM-Facial-Recognition/training.xml',
		// recognition intervall in seconds (smaller number = faster but CPU intens!)
		INTERVAL: 2,
		// Logout delay after last recognition so that a user does not get instantly logged out if he turns away from the mirror for a few seconds
		LOGOUT_DELAY: 15,
		// Array with usernames (copy and paste from training script)
		USER: []
	}
}
```

## Important Notes
- Currently this only displays who is recognised, as soon as module swaping is supported by the mirror system it will be added.

## Dependencies
- [OpenCV](http://opencv.org) (sudo apt-get install libopencv-dev python-opencv)

## Open Source Licenses
###[pi-facerec-box](https://github.com/tdicola/pi-facerec-box)
The MIT License (MIT)

Copyright (c) 2014 Tony DiCola

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

The negative training data is from the ORL face database.  Please see the file
tools/facetrainer/training_data/negative/README for more information on this data.