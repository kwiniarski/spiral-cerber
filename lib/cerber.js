'use strict';

var util = require('./util');

function generateRequestHash(data, token) {
  return util.hmacHash('sha1', token, [
    'hmac.client',
    data.ts,
    data.nonce,
    data.method,
    data.url,
    data.hostName,
    data.hostPort,
    data.contentType
  ].join('\u000A'));
}

function authFactory(config) {

  var MAX_REQUEST_VALIDITY_MS = 60000 // 60 sec.
    , HEADER_RX = /^hmac(\s[a-z]+=[\w\-]+)+$/

    , identify = config.identifyCallback
    , apiKey = config.apiKey || 'apiKey'

    , options = {
        validityTime: MAX_REQUEST_VALIDITY_MS
      };

  function decomposeAuthorizationHeader(header) {

    if (!header || !HEADER_RX.test(header)) {
      return false;
    }

    var data = {}
      , headerData = String(header).split(' ');

    data.type = headerData[0].toLowerCase();

    headerData.slice(1).forEach(function (headerPart) {
      var entry = headerPart.split('=')
        , entryKey = entry[0].toLowerCase();

      if (entryKey === 'ts') {
        data[entryKey] = parseInt(entry[1], 10);
      }

      else {
        data[entryKey] = entry[1];
      }
    });

    return data;
  }

  function decomposeContentTypeHeader(header) {

    if (!header) {
      return 'text/plain';
    }

    var content = {}
      , contentType = header.split(/;\s*/g);

    content.type = contentType[0].toLowerCase();
    content.encoding = contentType[1] ? contentType[1].toLowerCase() : 'utf-8';

    return content;
  }

  function decomposeHost(request) {
    var host = {}
      , hostName = request.headers.host || request.host
      , hostData = hostName.split(':')
      , defaultPort = request.connection && request.connection.encrypted ? 443 : 80;

    host.name = hostData[0];
    host.port = hostData[1] ? parseInt(hostData[1], 10) : defaultPort;

    return host;
  }

  function calculateRequestHash(request, token) {
    var credentials = decomposeAuthorizationHeader(request.headers.authorization)
      , host = decomposeHost(request)
      , content = decomposeContentTypeHeader(request.headers['content-type']);

    return generateRequestHash({
      ts: credentials.ts,
      nonce: credentials.nonce,
      method: request.method,
      url: request.url,
      hostName: host.name,
      hostPort: host.port,
      contentType: content.type
    }, token);
  }

  function unauthorized(reason) {
    var err = new Error();

    err.message = reason;
    err.status = 403;

    return err;
  }

  function hasValidTimestamp(ts) {
    return Math.abs(util.utcNow() - ts) <= options.validityTime;
  }

  var api = {
    set: function (option, value) {
      options[option] = value;
    },

    /**
     * Method for authorizing incoming requests
     * @param {Object} request Express request object
     * @param {Function} cb Node style callback function (first argument should be an Error or null)
     */
    authorizeRequest: function (request, cb) {
      var credentials = decomposeAuthorizationHeader(request.headers.authorization);

      if (!credentials) {
        cb(unauthorized('Invalid Authorization header', request));
      }

      else if (!hasValidTimestamp(credentials.ts)) {
        cb(unauthorized('Request does not match time bounds', request, options));
      }

      else {
        identify(credentials.id, function (err, identity) {

          if (!identity) {
            cb(unauthorized('Authorization required', request, identity));
          }

          else if (!identity.nonce(credentials.nonce)) {
            cb(unauthorized('Request nonce is invalid', request, options));
          }

          else if (credentials.hash !== calculateRequestHash(request, identity[apiKey])) {
            cb(unauthorized('Invalid request hash', request, identity));
          }

          else {
            request.credentials = credentials;
            request.identity = identity;
            cb(null, identity);
          }
        });
      }

    }
  };

  return api;
}

authFactory.generateRequestHash = generateRequestHash;

authFactory.utils = util;

module.exports = authFactory;
