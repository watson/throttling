'use strict';

var cacher = module.exports = function (ms, fn) {
  var cache, cachedAt;
  if (typeof ms === 'function') return cacher(Infinity, ms);
  return function (cb) {
    if (!cache || cachedAt + ms < Date.now())
      fn(function () {
        cache = arguments;
        cachedAt = Date.now();
        cb.apply(null, cache);
      });
    else
      process.nextTick(function () {
        cb.apply(null, cache);
      });
  };
};
