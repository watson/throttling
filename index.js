'use strict';

var util = require('util');

var cacher = module.exports = function (ms, fn) {
  var cache, cachedAt;
  if (typeof ms === 'function') return cacher(Infinity, ms);
  return function (cb) {
    if (!cache || cachedAt + ms < Date.now())
      fn(function (err) {
        if (util.isError(err)) {
          cache = cachedAt = null;
        } else {
          cache = arguments;
          cachedAt = Date.now();
        }
        cb.apply(null, arguments);
      });
    else
      process.nextTick(function () {
        cb.apply(null, cache);
      });
  };
};
