'use strict';

module.exports = function (fn, ms) {
  var cache, cachedAt;
  if (!ms) ms = Infinity;
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
