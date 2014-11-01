# throttling

Throttle a function and cache the result for x milliseconds.

[![Build Status](https://travis-ci.org/watson/throttling.png)](https://travis-ci.org/watson/throttling)

## Example

```js
var fs = require('fs');
var throttle = require('throttling');

var getFile = throttle(1000*60, function (callback) {
  fs.readFile('/etc/passwd', callback);
});

getFile(function (err, data) {
  console.log(data);
});
```

## Usage

Requireing throttling returns a generator function. The most simple
way to use throttling is to call this generator function with the
function you want to throttle:

```js
var calls = 0;
var runner = throttle(function () {
  return ++calls;
});
```

The generator function returns a `runner` function. The first time you
call the `runner` function, the throttled function will be called and
its output will be cached and returned by the runner function. By
default subsequent calls to the `runner` function will **not** call the
throttled function, but just return the cached result:

```js
runner(); // => 1
runner(); // => 1
runner(); // => 1
```

### Cache timeout

You can also set a cache timeout. Parse an integer representing the
cache timeout in milliseconds as the first argument to the generator
function:

```js
var calls = 0;
var runner = throttle(1000, function () {
  return ++calls;
});

runner(); // => 1
runner(); // => 1
setTimeout(runner, 1001); // => 2
```

### Async

The throttled function is called with a callback as the first argument.
If your function needs to do any async work, call this with the result
when done:

```js
var runner = throttle(1000, function (callback) {
  process.nextTick(function () {
    callback(Math.random());
  });
});
```

To get the result of your async function, use a callback when calling
the `runner` function:

```js
runner(function (result) {
  console.log('The random number is:', result);
});
```

The arguments parsed to the callback will be cached according to the
same rules as described previously, so subsequent executions of `runner`
will just call the supplied callback function with the previous
arguments until the cache expires.

### Delayed callback

When setting up the `runner` function, it's possible to specify that the
callback shouldn't be called with the cached arguments, but instead
`wait` for the cache to expire, and then be called with the new callback
arguments from the throttled function:

```js
var calls = 0;
var options = {
  timeout: 1000,
  wait: true
};
var runner = throttle(options, function (callback) {
  process.nextTick(function () {
    callback(++calls);
  });
});

runner(function (result) {
  console.log('1st call:', result);
});
runner(function (result) {
  console.log('2nd call:', result);
});
runner(function (result) {
  console.log('3rd call:', result);
});
```

The above code will first output `1st call: 1`. Then it will wait
aproximently 1 second and output:

```
2nd call: 2
3rd call: 2
```

Notice how the timeout is now supplied using the `timeout` property in
the options hash.

### Error handling

If the first argument parsed to the `fn` callback is an `Error`, the
callback will not be cached.

```js
var calls = 0;
var runner = throttle(1000, function (callback) {
  callback(new Error(), ++calls);
});

var fn = function (err, result) {
  console.log(result);
};

runner(fn); // calls `fn` with the error and the result 1
runner(fn); // calls `fn` with the error and the result 2
runner(fn); // calls `fn` with the error and the result 3
```

Note that if `options.wait` is `true`, the throttling will still be in
effect and the `fn` function will only be called once for every
`options.timeout`.

## License

MIT
