'use strict';

function RequestMock(settings) {

  if (!settings) {
    settings = RequestMock.defaults;
  }

  if (settings.url) {
    this.url = settings.url;
  }

  if (settings.method) {
    this.method = settings.method.toUpperCase();
  }

  if (settings.headers) {
    for (var headerName in settings.headers) {
      this.headers[headerName.toLowerCase()] = settings.headers[headerName];

      if (headerName.toLowerCase() === 'host') {
        this.host = settings.headers[headerName];
      }
    }
  }

  if (settings.connection) {
    for (var option in settings.connection) {
      this.connection[option] = settings.connection[option];
    }
  }

};

RequestMock.defaults = {
  host: 'localhost',
  url: '/',
  method: 'GET',
  headers: {
    host: 'localhost',
    'content-type': 'application/json; encoding=utf8'
  },
  connection: {
    encrypted: false
  }
};

RequestMock.prototype = {
  _readableState: {},
  readable: true,
  domain: null,
  _events: {},
  _maxListeners: 10,
  socket: {},
  connection: {
    encrypted: false
  },
  httpVersion: '1.1',
  complete: false,
  headers: {
    connection: 'keep-alive'
  },
  trailers: {},
  _pendings: [],
  _pendingIndex: 0,
  url: '/',
  method: 'GET',
  statusCode: null,
  client: {},
  _consuming: false,
  _dumped: false,
  httpVersionMajor: 1,
  httpVersionMinor: 1,
  upgrade: false
};

module.exports = RequestMock;
