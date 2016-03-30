'use strict';
const NodeHelper = require('node_helper');

const PythonShell = require('python-shell');

module.exports = NodeHelper.create({
  
 // Subclass socketNotificationReceived received.
socketNotificationReceived: function(notification, payload) {
  if(notification === 'CONFIG') {
    this.config = payload;
  }
},
  // Subclass start method.
  start: function() {
  var config_check = setInterval(function() {
    if (this.config) {
      clearInterval(config_check);
      python_start(); // the function to run once all flags are true
    }
  }, 500); // interval set at 100 milliseconds
  },
  
  python_start: function () {
    const starter = {RECOGNITION_ALGORITHM: "1", TRAINING_FILE: 'modules/' + this.name + "/training.xml",  INTERVAL: 2}
    const self = this;
    const pyshell = new PythonShell('modules/' + this.name + '/facerecognition/facerecognition.py', { mode: 'json', args: [JSON.stringify(this.config)]});

    pyshell.on('message', function (message) {
      
      if (message.hasOwnProperty('status')){
      console.log("[MMM-Facial-Recognition] " + message.status);
      }
      if (message.hasOwnProperty('login')){
        console.log("[MMM-Facial-Recognition] " + "User " + message.login.user + " with confidence " + message.login.confidence + " logged in.");
        self.sendSocketNotification('user', {action: "login", user: message.login.user, confidence: message.login.confidence});
        }
      if (message.hasOwnProperty('logout')){
        console.log("[MMM-Facial-Recognition] " + "User " + message.logout.user + " logged out.");
        self.sendSocketNotification('user', {action: "logout", user: message.logout.user});
        }
    });

    pyshell.end(function (err) {
      if (err) throw err;
      console.log("[MMM-Facial-Recognition] " + 'finished');
    });
  }
  
});