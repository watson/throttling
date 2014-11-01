'use strict';

var util = require('util');

var noop = function () {};

var cache = module.exports = function (opts, fn) {
  switch (typeof opts) {
    case 'function': return cache({ timeout: Infinity }, opts);
    case 'number': return cache({ timeout: opts }, fn);
  }

  var queue = [];
  var expires = 0;
  var argsCache, resCache, throttleIdent;

  var wait = function (cb) {
    queue.push(cb);
    if (throttleIdent) return;
    throttleIdent = setTimeout(function () {
      var oldQueue = queue;
      queue = [];
      throttleIdent = null;
      resCache = run(function () {
        var cb;
        while (cb = oldQueue.shift()) {
          cb.apply(null, arguments);
        }
      });
    }, expires - Date.now());
  };

  var run = function (cb) {
    return fn(function (err) {
      var args = arguments;
      if (util.isError(err)) {
        expires = 0;
      } else {
        argsCache = args;
        expires = Date.now() + opts.timeout;
      }
      process.nextTick(function () {
        cb.apply(null, args);
      });
    });
  };

  var runner = function (cb) {
    if (!cb) cb = noop;
    if (opts.wait) {
      return wait(cb);
    } else if (expires <= Date.now()) {
      if (!fn.length) expires = Date.now() + opts.timeout;
      return resCache = run(cb);
    }
    process.nextTick(function () {
      cb.apply(null, argsCache);
    });
    return resCache;
  };

  return runner;
};
