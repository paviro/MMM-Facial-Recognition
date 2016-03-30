'use strict';
const NodeHelper = require('node_helper');

const PythonShell = require('python-shell');
var pythonStarted = false

module.exports = NodeHelper.create({
  
  python_start: function (config) {
    const starter = {RECOGNITION_ALGORITHM: "1", TRAINING_FILE: 'modules/' + this.name + "/training.xml",  INTERVAL: 2}
    const self = this;
    const pyshell = new PythonShell('modules/' + this.name + '/facerecognition/facerecognition.py', { mode: 'json', args: [JSON.stringify(config)]});

    pyshell.on('message', function (message) {
      
      if (message.hasOwnProperty('status')){
      console.log("[MMM-Facial-Recognition] " + message.status);
      }
      if (message.hasOwnProperty('login')){
        console.log("[MMM-Facial-Recognition] " + "User " + self.config.USER[message.login.user - 1] + " with confidence " + message.login.confidence + " logged in.");
        self.sendSocketNotification('user', {action: "login", user: self.config.USER[message.login.user - 1], confidence: message.login.confidence});
        }
      if (message.hasOwnProperty('logout')){
        console.log("[MMM-Facial-Recognition] " + "User " + self.config.USER[message.logout.user - 1] + " logged out.");
        self.sendSocketNotification('user', {action: "logout", user: self.config.USER[message.logout.user - 1]});
        }
    });

    pyshell.end(function (err) {
      if (err) throw err;
      console.log("[MMM-Facial-Recognition] " + 'finished');
    });
  },
  
  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if(notification === 'CONFIG') {
      this.config = payload
      if(!pythonStarted) {
        pythonStarted = true;
        this.python_start(payload);
        };
    };
  }
  
});