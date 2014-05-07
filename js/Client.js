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
};


module.exports = Client;
