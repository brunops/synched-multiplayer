function MessageQueue(latency) {
  this.init(latency);
}

MessageQueue.prototype.init = function (latency) {
  this.latency = latency || 0;
  this.messages = [];
};

MessageQueue.prototype.enqueue = function (msg) {
  msg.t = msg.t || Date.now();
  this.messages.push(msg)
};

MessageQueue.prototype.dequeue = function () {
  return this.messages.pop();
};

module.exports = MessageQueue;
