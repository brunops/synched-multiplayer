var UpdatesBuffer = require('./UpdatesBuffer');
var Entity = require('./Entity');

function Client(opts) {
  this.init(opts || {});
}

Client.prototype.init = function (opts) {
  this.ub = new UpdatesBuffer(100);
};
