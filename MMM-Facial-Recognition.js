/* global Module */

/* Magic Mirror
 * Module: MMM-Facial-Recognition
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register('MMM-Facial-Recognition',{
	
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
			this.current_user = payload.user;
			this.updateDom(3000);
		}
		else if (payload.action == "logout"){
			this.current_user = null;
			this.updateDom(3000);
		}
	},
	
	start: function() {
		this.current_user = null;
		this.sendSocketNotification('CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
	},
	
	getDom: function() {
		if (this.current_user != null){
		var wrapper = document.createElement("div");
		
		wrapper.className = "normal medium"
		wrapper.innerHTML = "Hello " + this.current_user +  "!"

		return wrapper;
		}
		else {
			return document.createElement("div");
		}
	}

});