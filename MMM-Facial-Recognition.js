/* global Module */

/* Magic Mirror
 * Module: MMM-Facial-Recognition
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.create({
	
	defaults: {
		// 1=LBPH | 2=Fisher | 3=Eigen
		RECOGNITION_ALGORITHM: 1,
		// Path to your training xml
		TRAINING_FILE: 'modules/MMM-Facial-Recognition/training.xml',
		// recognition intervall in seconds (smaller number = faster but CPU intens!)
		INTERVAL: 2,
		// Logout delay after last recognition so that a user does not get instantly logged out if he turns away from the mirror for a few seconds
		LOGOUT_DELAY: 15,
		// Array with usernames (copy and paste from training script)
		USER: []
	},
	
	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (payload.action == "login"){
			console.log("Logged in user " + payload.user + " with confidence " + payload.confidence.toString() + ".");
		}
		else if (payload.action == "logout"){
			console.log("Logged out user " + payload.user + ".");
		}
	},
	
	start: function() {
		this.sendSocketNotification('CONFIG', this.config);
		
		Log.info('Starting module: ' + this.name);
	}

});