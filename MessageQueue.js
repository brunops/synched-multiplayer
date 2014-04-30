function MessageQueue(opts) {
  this.init(opts);
}

MessageQueue.prototype.init = function (opts) {
  opts = opts || {};

  this.latency = opts.latency || 0;
};

module.exports = MessageQueue;
