'use strict';

var util = require('util');

var noop = function () {};

var cache = module.exports = function (ms, fn) {
  var argsCache, resCache, cachedAt;
  if (typeof ms === 'function') return cache(Infinity, ms);
  return function (cb) {
    if (!cb) cb = noop;
    if (!cachedAt || cachedAt + ms < Date.now()) {
      if (!fn.length) cachedAt = Date.now();
      return resCache = fn(function (err) {
        if (util.isError(err)) {
          argsCache = cachedAt = null;
        } else {
          argsCache = arguments;
          cachedAt = Date.now();
        }
        var args = arguments;
        process.nextTick(function () {
          cb.apply(null, args);
        });
      });
    }

    process.nextTick(function () {
      cb.apply(null, argsCache);
    });
    return resCache;
  };
};
