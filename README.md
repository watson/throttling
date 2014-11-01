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

## License

MIT
