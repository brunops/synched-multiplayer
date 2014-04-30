function MessageQueue(opts) {
  this.init(opts);
}

MessageQueue.prototype.init = function (opts) {
  opts = opts || {};

  this.latency = opts.latency || 0;
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
