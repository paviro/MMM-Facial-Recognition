# MMM-Facial-Recognition
This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). It provides facial recognition and module swaping based on the current user.

## Usage
To train the needed model use the [MMM-Facial-Recognition-Tools](https://github.com/paviro/MMM-Facial-Recognition-Tools).

The entry in config.js can look like the following. (NOTE: You only have to add the variables to config if want to change its standard value.)

```
{
	module: 'MMM-Facial-Recognition',
	config: {
		// 1=LBPH | 2=Fisher | 3=Eigen
		recognitionAlgorithm: 1,
		// Threshold for the confidence of a recognized face before it's considered a
		// positive match.  Confidence values below this threshold will be considered
		// a positive match because the lower the confidence value, or distance, the
		// more confident the algorithm is that the face was correctly detected.
		lbphThreshold: 50,
		fisherThreshold: 250,
		eigenThreshold: 3000,
		// force the use of a usb webcam on raspberry pi (on other platforms this is always true automatically)
		useUSBCam: false,
		// Path to your training xml
		trainingFile: 'modules/MMM-Facial-Recognition/training.xml',
		// recognition intervall in seconds (smaller number = faster but CPU intens!)
		interval: 2,
		// Logout delay after last recognition so that a user does not get instantly logged out if he turns away from the mirror for a few seconds
		logoutDelay: 15,
		// Array with usernames (copy and paste from training script)
		users: [],
		//Module set used for strangers and if no user is detected
		defaultClass: "default",
		//Set of modules which should be shown for every user
		everyoneClass: "everyone",
		// Boolean to toggle welcomeMessage
		welcomeMessage: true
	}
}
```

In order for this module to do anything useful you have to assign custom classes to your modules. The class `default` (if you don't change it) is shown if no user is detected or a stranger. The class `everyone` (if you don't change it) is shown for all users. To specify modules for a certain user, use their name as classname.

```
{
	module: 'example_module',
	position: 'top_left',
	//Set your classes here seperated by a space.
	//Shown for all users
	classes: 'default everyone'
},
{
	module: 'example_module2',
	position: 'top_left',
	//Only shown for me
	classes: 'Paul-Vincent'
}
```

## Dependencies
- [python-shell](https://www.npmjs.com/package/python-shell) (installed via `npm install`)
- [OpenCV](http://opencv.org) (`sudo apt-get install libopencv-dev python-opencv`)

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
