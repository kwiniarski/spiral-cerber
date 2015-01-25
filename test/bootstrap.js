/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var chai = require('chai');
var sinon = require('sinon');
var mockery = require('mockery');
chai.use(require('sinon-chai'));

global.mockery = mockery;
global.sinon = sinon;
global.expect = chai.expect;
