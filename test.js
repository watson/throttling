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

test('should call the callback with an error and one or more aguments', function (t) {
  var run = cache(function (cb) {
    cb(1,2,3,4);
  });
  run(function (a,b,c,d) {
    t.equal(a, 1);
    t.equal(b, 2);
    t.equal(c, 3);
    t.equal(d, 4);
    t.end();
  });
});

test('should cache the result for a 2nd call', function (t) {
  var run = cache(function (cb) {
    cb(null, Math.random());
  });
  run(function (err, r1) {
    run(function (err, r2) {
      t.equal(r1, r2);
      t.end();
    });
  });
});

test('should expire the cache after the timeout', function (t) {
  var run = cache(function (cb) {
    cb(null, Math.random());
  }, 50);
  run(function (err, r1) {
    setTimeout(function () {
      run(function (err, r2) {
        t.notEqual(r1, r2);
        t.end();
      });
    }, 80);
  });
});
