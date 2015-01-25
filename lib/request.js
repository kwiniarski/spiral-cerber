'use strict';

var authFactory = require('./cerber');

module.exports = function authorizeRequestMixinFactory(config) {

  var auth = authFactory(config);

  return function authorizeRequestMixin(req, res, next) {
    req.authorize = function () {
      auth.authorizeRequest(req, next);
    };
    return next();
  };

};
