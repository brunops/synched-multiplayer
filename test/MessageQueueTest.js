var test = require('tape');

var MessageQueue = require('../MessageQueue');

test(function (t) {
  t.plan(4);

  var mq = new MessageQueue();
  t.equal(mq.latency, 0);

  var msg = {
    t: (new Date()).getTime(),
    payload: 'sup, bro'
  };
  mq.enqueue(msg);

  t.equal(mq.dequeue(), msg);

  // t is always defined in a msg
  msg = {
    payload: 'hey'
  };
  mq.enqueue(msg);
  t.notEqual(mq.dequeue().t, undefined);

  // message queues can be initialized with a latency value
  mq = new MessageQueue(100);
  t.equal(mq.latency, 100);

});
