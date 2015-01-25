/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var util = require('../../lib/util');

util.utcNow = function () {
  return 1391252400000;
};

module.exports = util;
