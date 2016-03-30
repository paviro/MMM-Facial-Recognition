/* global Module */

/* Magic Mirror
 * Module: MMM-FRITZ-Box-Callmonitor
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.create({
	
	// Default module config.
	defaults: {
		RECOGNITION_ALGORITHM: 1,
		TRAINING_FILE: 'modules/' + this.name + "/training.xml",
		INTERVAL: 2,
		people: ['s', 'sd']
	},
	
	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		console.log(notification);
	},
	
	start: function() {
		this.sendSocketNotification('CONFIG', this.config);
		
		Log.info('Starting module: ' + this.name);
	}

});