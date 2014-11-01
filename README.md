# cache-callback

Cache the result of a callback for x milliseconds.

[![Build Status](https://travis-ci.org/watson/cache-callback.png)](https://travis-ci.org/watson/cache-callback)

## Usage

```js
var fs = require('fs');
var cache = require('cache-callback');

var getFile = cache(1000*60, function (callback) {
  fs.readFile('/etc/passwd', callback);
});

getFile(function (err, data) {
  console.log(data);
});
```

## API

Requireing cache-callback returns a function you can use to build
caches:

```js
var runner = cache([ms, ]fn)
```

Arguments:

- `ms` - The amount of milliseconds to cache the callback of the `fn`
  function. If omitted, the callback will be cache forever
- `fn` - The function whos callback to cache. The function will be
  called with a single callback which it must call with the result of
  the function

The cache function returns a runner function:

```js
runner(callback)
```

Arguments:

- `callback` - This callback will be called with whatever arguments the
  `fn` function calls its callback with. If the runner is called a 2nd
  time before the cache expires, the callback will be called with the
  cached arguments

## License

MIT
