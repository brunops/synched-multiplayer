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
