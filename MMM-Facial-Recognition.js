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
		USER: [],
		//Module set used for strangers and if no user is detected
		DEFAULT_CLASS: "default",
		//Set of modules which should be shown for every user
		FOR_ALL: "for_all"
		
	},
	login_user: function () {
		
		MM.getModules().withClass(this.config.DEFAULT_CLASS).exceptWithClass(this.config.FOR_ALL).enumerate(function(module) {
			module.hide(1000, function() {
				Log.log(module.name + ' is hidden.');
			});
		});
		
		MM.getModules().withClass(this.current_user).enumerate(function(module) {
			module.show(1000, function() {
				Log.log(module.name + ' is shown.');
			});
		});
	},
	logout_user: function () {
		
		MM.getModules().withClass(this.current_user).enumerate(function(module) {
			module.hide(1000, function() {
				Log.log(module.name + ' is hidden.');
			});
		});
		
		MM.getModules().withClass(this.config.DEFAULT_CLASS).exceptWithClass(this.config.FOR_ALL).enumerate(function(module) {
			module.show(1000, function() {
				Log.log(module.name + ' is shown.');
			});
		});
	},
	
	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (payload.action == "login"){
			if (this.current_user_id != payload.user){
				this.logout_user()
			}
			if (payload.user == -1){
				this.current_user = "stranger"
				this.current_user_id = payload.user;
				this.sendNotification("SHOW_ALERT", {type: "notification", message: "Hello stranger, nice to meet you!", title: "Facial-Recognition"}); 
			}
			else{				
				this.current_user = this.config.USER[payload.user];
				this.current_user_id = payload.user;
				this.login_user()
				this.sendNotification("SHOW_ALERT", {type: "notification", message:"Hello " + this.current_user + ", nice to meet you!", title: "Facial-Recognition"}); 
			}
		}
		else if (payload.action == "logout"){
			this.logout_user()
			this.current_user = null;
		}
	},
	
	notificationReceived: function(notification, payload, sender) {
		if (notification === 'DOM_OBJECTS_CREATED') {
			MM.getModules().exceptWithClass("default").enumerate(function(module) {
				console.log(module);
				module.hide(1000, function() {
					Log.log('Module is hidden.');
				});
			});
		}
	},
	
	start: function() {
		this.current_user = null;
		this.sendSocketNotification('CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
	}

});