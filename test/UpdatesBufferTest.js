var test = require('tape');

var UpdatesBuffer = require('../UpdatesBuffer');

test(function (t) {
  t.plan(13);

  // ------- New buffer with 0ms latency
  var ub = new UpdatesBuffer();
  t.equal(ub.latency, 0);

  var msg = {
    t: (new Date()).getTime(),
    payload: 'sup, bro'
  };
  ub.add(msg);

  t.equal(ub.getLast(), msg);

  msg = {
    payload: 'hey'
  };
  ub.add(msg);
  t.notEqual(ub.getLast().t, undefined, 't is always defined in a msg');

  // ------- New buffer with 0ms latency
  ub = new UpdatesBuffer();
  t.equal(ub.getLastUpdates(), null, '#getLastUpdates returns null when there are less than 2 updates');

  var msg2 = {
    payload: 'payload'
  };
  ub.add(msg);
  ub.add(msg2);
  t.deepEqual(Object.keys(ub.getLastUpdates()), ['from', 'to'], '#getLastUpdates return object with keys "from" and "to"');

  t.equal(ub.size(), 2, '#size returns current updates buffer size');

  var msg3 = {
    payload: 'payload3'
  };
  ub.add(msg3);
  t.deepEqual(ub.getLastUpdates(), { from: msg2, to: msg3 }, '#getLastUpdates returns last two valid updates even when size is bigger than two');

  // ------- New buffer with 100ms latency
  ub = new UpdatesBuffer(100);
  ub.add(msg);
  ub.add(msg2);
  t.equal(ub.latency, 100, 'updates buffer can be initialized with a latency value');
  t.equal(ub.getLastUpdates(), null, '#getLastUpdates takes latency into consideration and returns only updates where the timestamp has expired latency');

  // ------- New buffer with 100ms latency
  ub = new UpdatesBuffer(100);
  msg.t -= 100;
  msg2.t -= 100;
  ub.add(msg);
  ub.add(msg2);
  ub.add(msg3);
  t.deepEqual(ub.getLastUpdates(), { from: msg, to: msg2 }, '#getLastUpdates takes latency into consideration and returns only updates where the timestamp has expired latency (although msg3 is the last update, it is not returned because its timestamp is not experied yet)');

  // ------- New buffer with 100ms latency
  ub = new UpdatesBuffer(150);
  msg = {
    t: (new Date()).getTime() - 200,
    payload: 1
  };
  msg2 = {
    t: (new Date()).getTime() - 190,
    payload: 12
  };
  msg3 = {
    t: (new Date()).getTime() - 180,
    payload: 123
  };
  var msg4 = {
    t: (new Date()).getTime() - 140,
    payload: 1234
  };
  ub.add(msg);
  ub.add(msg2);
  ub.add(msg3);
  ub.add(msg4);
  t.equal(ub.size(), 4, '#size is 4');
  t.deepEqual(ub.getLastUpdates(), { from: msg2, to: msg3 }, '#getLastUpdates returns last valid updates (msg2 and msg3)');
  t.deepEqual(ub.size(), 3, '#getLastUpdates deletes older invalid messages');


});
