'use strict';

var slice = Array.prototype.slice
  , forge = require('node-forge');

function hmacHash() {
  var args = slice.call(arguments)
    , algorithm = args[0].toLowerCase()
    , key = args[1]
    , data = args.slice(2)
    , hmac = forge.hmac.create();

  hmac.start(algorithm, key);
  data.forEach(function (part) {
    hmac.update(part);
  });

  return hmac.digest().toHex();
}

function utcNow() {
  return utcTime(new Date());
}

function utcTime(timestamp) {
  var time;

  if (timestamp instanceof Date) {
    time = timestamp;
  }

  else {
    time = new Date(timestamp);
  }

  return Date.UTC.apply(Date, [
    time.getFullYear(),
    time.getMonth(),
    time.getDate(),
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  ]);
}

module.exports = {
  hmacHash: hmacHash,
  utcNow: utcNow,
  utcTime: utcTime
};
