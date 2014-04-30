var test = require('tape');

var UpdatesBuffer = require('../UpdatesBuffer');

test(function (t) {
  t.plan(4);

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

  ub = new UpdatesBuffer(100);
  t.equal(ub.latency, 100, 'updates buffer can be initialized with a latency value');


});
