var UpdatesBuffer = require('./UpdatesBuffer');
var Entity = require('./Entity');

function Client(opts) {
  this.init(opts || {});
}

Client.prototype.init = function (opts) {
  // temporary code to make things work :)
  // should be initialized only upon connection
  this.mainEntityId = 1;
  this.entities = {};
  this.entities[this.mainEntityId] = new Entity();

  this.width = 500;
  this.height = 500;
  // ------------------------[end of temp code]

  this.keyboardState = {};
  this.bindEvents();
};

Client.prototype.bindEvents = function () {
  this.bindKeyboardHandling();
};

Client.prototype.bindKeyboardHandling = function () {
  var self = this;

  document.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
      case 37:
        self.keyboardState.LEFT = true;
        break;
      case 38:
        self.keyboardState.UP = true;
        break;
      case 39:
        self.keyboardState.RIGHT = true;
        break;
      case 40:
        self.keyboardState.DOWN = true;
        break;
    }
  });

  document.addEventListener('keyup', function (e) {
    switch (e.keyCode) {
      case 37:
        delete self.keyboardState.LEFT;
        break;
      case 38:
        delete self.keyboardState.UP;
        break;
      case 39:
        delete self.keyboardState.RIGHT;
        break;
      case 40:
        delete self.keyboardState.DOWN;
        break;
    }
  });
};

Client.prototype.cloneKeyboardState = function () {
  var keyboardState = {};

  for (var key in this.keyboardState) {
    keyboardState[key] = true;
  }

  return keyboardState;
};


module.exports = Client;
