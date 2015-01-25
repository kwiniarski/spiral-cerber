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
  var now = new Date();
  return Date.UTC.apply(Date, [
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds()
  ]);
}

module.exports = {
  hmacHash: hmacHash,
  utcNow: utcNow,
};
