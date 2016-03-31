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
			console.log(payload.user);
			if (payload.user == -1){
				this.current_user = "stranger"
			}
			else{
				this.current_user = this.config.USER[payload.user];
			}
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
		var wrapper = document.createElement("div");
		wrapper.className = "normal light"
		if (this.current_user != null){
		wrapper.innerHTML = "Hello " + this.current_user +  ". Nice to see you!"

		return wrapper;
		}
		else {
			wrapper.innerHTML = "No user recognized."
		}
		return wrapper;
	}

});