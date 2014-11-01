# cache-callback

Cache the result of a callback for x milliseconds. Will not cache if an
error occurs.

[![Build Status](https://travis-ci.org/watson/cache-callback.png)](https://travis-ci.org/watson/cache-callback)

## Usage

```js
var fs = require('fs');
var cache = require('cache-callback');

var getFile = cache(function (callback) {
  fs.readFile('/etc/passwd', callback);
}, 1000*60);


getFile(function (err, data) {
  console.log(data);
});
```

## License

MIT
