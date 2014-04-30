var test = require('tape');

var MessageQueue = require('../MessageQueue');

test(function (t) {
  t.plan(2);

  var mq = new MessageQueue();
  t.equal(mq.latency, 0);

  var msg = {
    t: (new Date()).getTime(),
    payload: 'sup, bro'
  };
  mq.enqueue(msg);

  t.equal(mq.dequeue(), msg);
});
