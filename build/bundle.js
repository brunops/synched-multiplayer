(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var UpdatesBuffer = require('./UpdatesBuffer');
var Entity = require('./Entity');

function Client(opts) {
  this.init(opts || {});
}

Client.prototype.init = function (opts) {
  this.context = opts.context;
  this.keyboardState = {};

  // temporary code to make things work :)
  // should be initialized only upon connection
  this.mainEntityId = 1;
  this.entities = {};
  this.entities[this.mainEntityId] = new Entity();

  this.width = 500;
  this.height = 500;
  // ------------------------[end of temp code]

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

Client.prototype.update = function () {
  this.processInputs();
  this.render();
};

Client.prototype.processInputs = function () {
  var now = (new Date()).getTime(),
      lastInputTime = this.lastInputTime || now,
      deltaModifier = (now - lastInputTime) / 1000,
      input = this.cloneKeyboardState();

  this.lastInputTime = now;

  if (!this.hasNewInput()) {
    // nothing new to process, bro
    return;
  }

  input.deltaModifier = deltaModifier;
  this.entities[this.mainEntityId].applyInput(input);
};

Client.prototype.render = function () {
  this.context.clearRect(0, 0, this.width, this.height);

  for (var entityId in this.entities) {
    this.entities[entityId].render(this.context);
  }
};

Client.prototype.hasNewInput = function () {
  return this.keyboardState.LEFT  ||
         this.keyboardState.RIGHT ||
         this.keyboardState.UP    ||
         this.keyboardState.DOWN  ||
         this.keyboardState.SPACE;
};

module.exports = Client;

},{"./Entity":2,"./UpdatesBuffer":3}],2:[function(require,module,exports){
function Entity(opts) {
  this.init(opts || {});
}

Entity.prototype.init = function (opts) {
  this.x = opts.x || 0;
  this.y = opts.y || 0;

  // speed in pixels per second
  this.speed = opts.speed || 150;

  this.color = opts.color || '#00f';
  this.borderSize = opts.borderSize || 3;
  this.borderColor = opts.borderColor || '#000';
  this.radius = opts.radius || 10;
};

Entity.prototype.applyInput = function (input) {
  if (input.LEFT) {
    this.x -= this.speed * input.deltaModifier;
  }

  if (input.RIGHT) {
    this.x += this.speed * input.deltaModifier;
  }

  if (input.DOWN) {
    this.y += this.speed * input.deltaModifier;
  }

  if (input.UP) {
    this.y -= this.speed * input.deltaModifier;
  }
};

Entity.prototype.render = function (ctx) {
  ctx.beginPath();
  ctx.fillColor = this.color;
  ctx.strokeSize = this.borderSize;
  ctx.strokeColor = this.borderColor;
  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
};

module.exports = Entity;

},{}],3:[function(require,module,exports){
function UpdatesBuffer(latency) {
  this.init(latency);
}

UpdatesBuffer.prototype.init = function (latency) {
  this.latency = latency || 0;
  this.updates = [];
};

UpdatesBuffer.prototype.add = function (msg) {
  msg.t = msg.t || (new Date()).getTime();
  this.updates.push(msg);
};

UpdatesBuffer.prototype.getLast = function () {
  return this.updates[this.updates.length - 1];
};

UpdatesBuffer.prototype.getLastUpdates = function () {
  for (var i = this.updates.length - 1; i > 0; --i) {
    if (this.isUpdateReady(this.updates[i])
        && this.isUpdateReady(this.updates[i - 1])) {

      this.updates.splice(0, i - 1);

      return {
        from: this.updates[0],
        to: this.updates[1]
      }
    }
  }

  return null;
};

UpdatesBuffer.prototype.size = function () {
  return this.updates.length;
};

UpdatesBuffer.prototype.isUpdateReady = function (update) {
  var now = (new Date()).getTime();

  return now - update.t >= this.latency;
};

module.exports = UpdatesBuffer;

},{}],4:[function(require,module,exports){
var Client = require('./Client');

(function () {
  var canvasContext = document.getElementById('canvas').getContext('2d');

  console.log(canvasContext)

  var client = new Client({
    context: canvasContext
  });

  setInterval(function () {
    client.update();
  }, 1000 / 60);
}());

},{"./Client":1}]},{},[4])