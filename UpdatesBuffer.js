function UpdatesBuffer(latency) {
  this.init(latency);
}

UpdatesBuffer.prototype.init = function (latency) {
  this.latency = latency || 0;
  this.messages = [];
};

UpdatesBuffer.prototype.enqueue = function (msg) {
  msg.t = msg.t || Date.now();
  this.messages.push(msg)
};

UpdatesBuffer.prototype.dequeue = function () {

  return this.messages.pop();
};

module.exports = UpdatesBuffer;
