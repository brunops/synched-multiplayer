var test = require('tape');

var MessageQueue = require('../MessageQueue');

test(function (t) {
  t.plan(1);

  var mq = new MessageQueue();
  t.equal(mq.latency, 0);

});
