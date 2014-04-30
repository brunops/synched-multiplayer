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

      // TODO: clear older updates
      return {
        from: this.updates[i - 1],
        to: this.updates[i]
      }
    }
  }

  return null;
};

UpdatesBuffer.prototype.isUpdateReady = function (update) {
  return true;
};

module.exports = UpdatesBuffer;
