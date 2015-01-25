/* jshint mocha: true, -W030, -W098, -W024 */

'use strict';

var util = require('../../lib/util')
  , middlewareFactory = require('../../lib/middleware')
  , AuthorizationHeaderMock = require('../mocks/authorization-header')
  , RequestMock = require('../mocks/request')
  , usersFixture = require('../fixtures/users')
  , userFixture = usersFixture[0];

describe('cerber middleware', function () {

	var requestMock
	  , configStub
	  , middleware
    , nextSpy = sinon.spy()
    , config = {
        apiKey: 'key',
        identifyCallback: function () {}
    }
    , CerberError = sinon.match(function (value) {
      return !!value
        && value instanceof Error
        && value.hasOwnProperty('status')
        && typeof value.status === 'number';
    }, "CerberError");

	beforeEach(function () {
    configStub = sinon.stub(config, 'identifyCallback');
    configStub.withArgs('53f1bf09d0a9371a5e11128f').yields(null, userFixture);
    configStub.withArgs('some_invalid_id').yields(null, null);

    middleware = middlewareFactory(config);

    requestMock = new RequestMock();
    requestMock.headers.authorization = new AuthorizationHeaderMock();
    requestMock.headers.authorization
      .set('ts', util.utcNow() - 15000) // now - 15 seconds
      .set('id', userFixture.id)
      .set('token', userFixture.key);
	});

  afterEach(function () {
    configStub.restore();
    nextSpy.reset();
  });

	it('should authorize request with valid Authorization header', function () {
		middleware(requestMock, null, nextSpy);
		expect(nextSpy).to.have.been.calledOnce.calledWith(null, userFixture);
	});

  it('should block request with invalid Authorization header', function () {
    delete requestMock.headers.authorization;
    middleware(requestMock, null, nextSpy);
    expect(nextSpy).to.have.been.calledOnce.calledWithMatch(CerberError);
  });

});
