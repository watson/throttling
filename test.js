'use strict';

var test = require('tape');
var cache = require('./');

test('should call the function first time', function (t) {
  var ran = false;
  var run = cache(function (cb) {
    ran = true;
    cb();
  }, 1000);
  run(function () {
    t.ok(ran);
    t.end();
  });
});

test('should allow the callback to be optional', function (t) {
  var run = cache(function (cb) {
    cb();
    t.ok(true);
    t.end();
  });
  run();
});

test('should call the callback with the fn callback arguments', function (t) {
  var run = cache(function (cb) {
    cb(1,2,3);
  });
  run(function (a,b,c,d) {
    t.equal(a, 1);
    t.equal(b, 2);
    t.equal(c, 3);
    t.end();
  });
});

test('should cache the result for a 2nd call', function (t) {
  var run = cache(function (cb) {
    cb(Math.random());
  });
  run(function (r1) {
    run(function (r2) {
      t.equal(r1, r2);
      t.end();
    });
  });
});

test('should expire the cache after the timeout', function (t) {
  var run = cache(50, function (cb) {
    cb(Math.random());
  });
  run(function (r1) {
    setTimeout(function () {
      run(function (r2) {
        t.notEqual(r1, r2);
        t.end();
      });
    }, 80);
  });
});

test('should clear the cache if an error occurs', function (t) {
  var run = cache(function (cb) {
    cb(new Error(), Math.random());
  });
  run(function (err, r1) {
    t.ok(err instanceof Error);
    run(function (err, r2) {
      t.ok(err instanceof Error);
      t.notEqual(r1, r2);
      t.end();
    });
  });
});
