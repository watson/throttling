'use strict';

var util = require('util');
var test = require('tape');
var throttle = require('./');

test('should return the return value of the throttled function', function (t) {
  var run = throttle(function () {
    return 42;
  });
  t.equal(run(), 42);
  t.end();
});

test('should only call the throttled function once', function (t) {
  var calls = 0;
  var run = throttle(function () {
    return ++calls;
  });
  t.equal(run(), 1);
  t.equal(run(), 1);
  t.end();
});

test('should call the throttled function again after a timeout', function (t) {
  var calls = 0;
  var run = throttle(30, function () {
    return ++calls;
  });
  t.equal(run(), 1);
  t.equal(run(), 1);
  setTimeout(function () {
    t.equal(run(), 2);
    t.equal(run(), 2);
    t.end();
  }, 50);
});

test('should be able to specify the timeout in an options hash', function (t) {
  var calls = 0;
  var run = throttle({ timeout: 30 }, function () {
    return ++calls;
  });
  t.equal(run(), 1);
  t.equal(run(), 1);
  setTimeout(function () {
    t.equal(run(), 2);
    t.equal(run(), 2);
    t.end();
  }, 50);
});

test('should work for async callbacks', function (t) {
  var calls = 0;
  var run = throttle(30, function (cb) {
    cb(++calls);
  });
  run(function (res) {
    t.equal(res, 1);
    run(function (res) {
      t.equal(res, 1);
      setTimeout(function () {
        run(function (res) {
          t.equal(res, 2);
          t.end();
        });
      }, 50);
    });
  });
});

test('should parse on all arugments to the callback', function (t) {
  var run = throttle(function (cb) {
    cb(1,2,3);
  });
  run(function (a,b,c) {
    t.equal(a, 1);
    t.equal(b, 2);
    t.equal(c, 3);
    t.end();
  });
});

test('should allow the runner callback to be optional', function (t) {
  var run = throttle(function (cb) {
    cb();
    t.ok(true);
    t.end();
  });
  run();
});

test('should use the cached arguments for a 2nd call', function (t) {
  var run = throttle(function (cb) {
    cb(Math.random());
  });
  run(function (r1) {
    run(function (r2) {
      t.equal(r1, r2);
      t.end();
    });
  });
});

test('should expire the arguments cache after the timeout', function (t) {
  var run = throttle(30, function (cb) {
    cb(Math.random());
  });
  run(function (r1) {
    setTimeout(function () {
      run(function (r2) {
        t.notEqual(r1, r2);
        t.end();
      });
    }, 50);
  });
});

test('should clear the caches if an error occurs', function (t) {
  var run = throttle(function (cb) {
    var rand = Math.random();
    cb(new Error(), rand);
    return rand;
  });
  var r1 = run(function (err, c1) {
    t.ok(util.isError(err));
    t.equal(r1, c1);
    var r2 = run(function (err, c2) {
      t.ok(util.isError(err));
      t.equal(r2, c2);
      t.notEqual(r1, r2);
      t.notEqual(c1, c2);
      t.end();
    });
  });
});

test('should throttle instead of cache if opts.wait is set', function (t) {
  var run = throttle({ timeout: 50, wait: true }, function (cb) {
    cb(Math.random());
  });
  var start = Date.now();
  var r1, r2;
  run(function (res) {
    r1 = res;
  });
  setTimeout(function () {
    run(function (res) {
      r2 = res;
    });
    run(function (r3) {
      var end = Date.now();
      t.ok(end - 45 > start, 'should wait ca 50ms');
      t.ok(Number.isFinite(r2), 'should be a finite number');
      t.notEqual(r1, r2);
      t.equal(r3, r2);
      t.end();
    });
  }, 10);
});

test('recursive', function (t) {
  var run = throttle({ timeout: 50, wait: true }, function (cb) {
    setTimeout(function () {
      cb(Math.random());
    }, 10);
  });
  var times = 5;
  run(function loop (result) {
    if (!--times) {
      setTimeout((function (oldTimes) {
        t.equal(times, oldTimes);
        t.end();
        process.exit();
      })(times), 30);
    }
    run(loop);
  });
});
