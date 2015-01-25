/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var util = require('../../lib/util');

module.exports = function AuthorizationHeaderMock() {
  this.id = '53f1bf09d0a9371a5e11128f';
  this.nonce = '11128f';
  this.ts = null;
  this.token = null;

  this.set = function (key, value) {
    this[key] = value;
    return this;
  };

  this.computeHash = function () {
    if (this.hash) {
      return this.hash;
    }

    var data = [
      'hmac.client',
      this.ts,
      this.nonce,
      'GET',
      '/',
      'localhost',
      80,
      'application/json'
    ].join('\u000A');

    return util.hmacHash('sha1', this.token, data);
  };

  this.toString = function () {
    return 'hmac id=' + this.id + ' nonce=' + this.nonce + ' ts=' + this.ts + ' hash=' + this.computeHash();
  };
};
