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
		// Use tosti007's MMM-ProfileSwitcher module
		// If true, do not forget to set the defaultClass to the same value as nobodyClass
		useProfileSwitcher: false
		
	},
	
	// Define required translations.
	getTranslations: function() {
		return {
			en: "translations/en.json",
			de: "translations/de.json",
      			es: "translations/es.json",
      			zh: "translations/zh.json",
      			nl: "translations/nl.json",
			fr: "translations/fr.json"
		};
	},
	
	login_user: function () {

		if (!this.config.useProfileSwitcher) {
			MM.getModules().withClass(this.config.defaultClass).exceptWithClass(this.config.everyoneClass).enumerate(function(module) {
				module.hide(1000, function() {
					Log.log(module.name + ' is hidden.');
				});
			});
			
			MM.getModules().withClass(this.current_user).enumerate(function(module) {
				module.show(1000, function() {
					Log.log(module.name + ' is shown.');
				});
			});
		}
		
		this.sendNotification("CURRENT_PROFILE", this.current_user);
	},
	logout_user: function () {

		if (!this.config.useProfileSwitcher) {
			MM.getModules().withClass(this.current_user).enumerate(function(module) {
				module.hide(1000, function() {
					Log.log(module.name + ' is hidden.');
				});
			});
			
			MM.getModules().withClass(this.config.defaultClass).exceptWithClass(this.config.everyoneClass).enumerate(function(module) {
				module.show(1000, function() {
					Log.log(module.name + ' is shown.');
				});
			});
		}
		
		this.sendNotification("CURRENT_PROFILE", this.config.defaultClass);
	},
	
	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (payload.action == "login"){
			if (this.current_user_id != payload.user){
				this.logout_user()
			}
			if (payload.user == -1){
				this.current_user = this.translate("stranger")
				this.current_user_id = payload.user;
			}
			else{				
				this.current_user = this.config.users[payload.user];
				this.current_user_id = payload.user;
				this.login_user()
			}
			
			if (!this.config.useProfileSwitcher){
				this.sendNotification("SHOW_ALERT", {type: "notification", message: this.translate("message").replace("%person", this.current_user), title: this.translate("title")});
			}
		}
		else if (payload.action == "logout"){
			this.logout_user()
			this.current_user = null;
		}
	},
	
	notificationReceived: function(notification, payload, sender) {
		if (notification === 'DOM_OBJECTS_CREATED' && this.config.useProfileSwitcher) {
			MM.getModules().exceptWithClass("default").enumerate(function(module) {
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
