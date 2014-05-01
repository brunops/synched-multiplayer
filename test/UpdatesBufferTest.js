var test = require('tape');

var UpdatesBuffer = require('../js/UpdatesBuffer');

test(function (t) {

  t.test('0ms latency Buffer', function (st) {
    var ub, msg;

    st.plan(3);

    ub = new UpdatesBuffer();
    st.equal(ub.latency, 0);

    msg = {
      t: (new Date()).getTime(),
      payload: 'sup, bro'
    };
    ub.add(msg);

    st.equal(ub.getLast(), msg);

    msg = {
      payload: 'hey'
    };
    ub.add(msg);
    st.notEqual(ub.getLast().t, undefined, 't is always defined in a msg');
  });

  t.test('#getLastUpdates for 0ms latency Buffer', function (st) {
    var ub, msg, msg2, msg3;
    st.plan(4);

    ub = new UpdatesBuffer();
    st.equal(ub.getLastUpdates(), null, '#getLastUpdates returns null when there are less than 2 updates');

    msg = {
      payload: 'hey'
    };
    msg2 = {
      payload: 'payload'
    };

    ub.add(msg);
    ub.add(msg2);
    st.deepEqual(Object.keys(ub.getLastUpdates()), ['from', 'to'], '#getLastUpdates return object with keys "from" and "to"');

    st.equal(ub.size(), 2, '#size returns current updates buffer size');

    var msg3 = {
      payload: 'payload3'
    };
    ub.add(msg3);
    st.deepEqual(ub.getLastUpdates(), { from: msg2, to: msg3 }, '#getLastUpdates returns last two valid updates even when size is bigger than two');
  });

  t.test('Buffer with 100ms latency and only to recent msgs', function (st) {
    var ub, msg, msg2, msg3;
    st.plan(2);

    ub = new UpdatesBuffer(100);

    msg = {
      payload: 'hey'
    };
    msg2 = {
      payload: 'payload'
    };

    ub.add(msg);
    ub.add(msg2);

    st.equal(ub.latency, 100, 'updates buffer can be initialized with a latency value');
    st.equal(ub.getLastUpdates(), null, '#getLastUpdates takes latency into consideration and returns only updates where the timestamp has expired latency');
  });

  t.test('Buffer with 100ms and recent and older valid msgs', function (st) {
    var ub, msg, msg2, msg3;
    st.plan(1);

    ub = new UpdatesBuffer(100);

    msg = {
      t: (new Date()).getTime() - 100,
      payload: 'hey'
    };
    msg2 = {
      t: (new Date()).getTime() - 100,
      payload: 'payload'
    };
    msg3 = {
      t: (new Date()).getTime(),
      payload: 'payload3'
    };

    ub.add(msg);
    ub.add(msg2);
    ub.add(msg3);

    st.deepEqual(ub.getLastUpdates(), { from: msg, to: msg2 }, '#getLastUpdates takes latency into consideration and returns only updates where the timestamp has expired latency (although msg3 is the last update, it is not returned because its timestamp is not experied yet)');
  });

  t.test('Buffer with 150ms latency and multiple valid messages keeps deleting too old messages', function (st) {
    var ub, msg, msg2, msg3, msg4;
    st.plan(3);

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
    msg4 = {
      t: (new Date()).getTime() - 140,
      payload: 1234
    };

    ub.add(msg);
    ub.add(msg2);
    ub.add(msg3);
    ub.add(msg4);

    st.equal(ub.size(), 4, '#size is 4');
    st.deepEqual(ub.getLastUpdates(), { from: msg2, to: msg3 }, '#getLastUpdates returns last valid updates (msg2 and msg3)');
    st.deepEqual(ub.size(), 3, '#getLastUpdates deletes older invalid messages');
  });
});
