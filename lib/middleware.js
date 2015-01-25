'use strict';

var authFactory = require('./cerber');

module.exports = function authorizeMiddlewareFactory(config) {

  var auth = authFactory(config);

  return function authorizeMiddleware(req, res, next) {
    auth.authorizeRequest(req, next);
  };

};
