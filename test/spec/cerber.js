'use strict';

var util = require('../../lib/util')
  , cerberFactory = require('../../lib/cerber')
  , AuthorizationHeaderMock = require('../mocks/authorization-header')
  , RequestMock = require('../mocks/request')
  , usersFixture = require('../fixtures/users')
  , userFixture = usersFixture[0];

describe('cerber factory', function () {

	var cerber
	  , ts
	  , configStub
	  , requestMock
    , nextSpy = sinon.spy()
    , CerberError = sinon.match(function (value) {
        return !!value
          && value instanceof Error
          && value.hasOwnProperty('status')
          && typeof value.status === 'number';
      }, "CerberError");

	beforeEach(function () {

		var now = util.utcTime(1391252400000) // Sat Feb 01 2014 12:00:00 GMT+0100
      , config = {
          apiKey: 'key',
          identifyCallback: function () {}
        };

    configStub = sinon.stub(config, 'identifyCallback');
    configStub.withArgs('53f1bf09d0a9371a5e11128f').yields(null, userFixture);
    configStub.withArgs('some_invalid_id').yields(null, null);

		ts = {
			now: now,
			nowMinus15sec: now - 15000,
			nowPlus15sec: now + 15000,
			invalid: now - 60000
		};

    requestMock = new RequestMock();
    requestMock.headers.authorization = new AuthorizationHeaderMock();
    requestMock.headers.authorization
      .set('ts', ts.nowMinus15sec)
      .set('id', userFixture.id)
      .set('token', userFixture.key);

    cerber = cerberFactory(config);
		cerber.set('validityTime', 30000); // +/- 30 sec
    cerber.set('clock', function () {
			return now;
		});
	});

	afterEach(function () {
    configStub.restore();
    nextSpy.reset();
	});

	describe('#authorizeRequest callback', function () {
		it('should be called with user data on valid request', function () {
      cerber.authorizeRequest(requestMock, nextSpy);
			expect(nextSpy).to.have.been.calledWith(null, userFixture);
		});
		it('should be called with user data on request with timestamp within accepted range', function () {
			requestMock.headers.authorization.set('ts', ts.now + 15000).set('hash', '25297b72b1dec5a82dcfc9a3ed605944c072d1b0');
      cerber.authorizeRequest(requestMock, nextSpy);
      expect(nextSpy).to.have.been.calledWith(null, userFixture);
		});
		it('should be called with an Error when authorization header is invalid', function () {
			delete requestMock.headers.authorization;
      cerber.authorizeRequest(requestMock, nextSpy);
      expect(nextSpy).to.have.been.calledWithMatch(CerberError);
		});
		it('should be called with an Error when sended hash do not match hash created by server', function () {
			requestMock.headers.authorization.set('hash', 'some_invalid_hash');
      cerber.authorizeRequest(requestMock, nextSpy);
      expect(nextSpy).to.have.been.calledWithMatch(CerberError);
		});
		it('should be called with an Error when user cannot be found', function () {
			requestMock.headers.authorization.set('id', 'some_invalid_id');
      cerber.authorizeRequest(requestMock, nextSpy);
      expect(nextSpy).to.have.been.calledWithMatch(CerberError);
		});
		it('should be called with an Error when request has expired past timestamp', function () {
			requestMock.headers.authorization.set('ts', ts.now - 60000);
      cerber.authorizeRequest(requestMock, nextSpy);
      expect(nextSpy).to.have.been.calledWithMatch(CerberError);
		});
		it('should be called with an Error when request has feature timestamp out of bounds', function () {
			requestMock.headers.authorization.set('ts', ts.now + 60000);
      cerber.authorizeRequest(requestMock, nextSpy);
      expect(nextSpy).to.have.been.calledWithMatch(CerberError);
		});
		it('should be called with an Error when nonce has been already used', function () {
			requestMock.headers.authorization.set('nonce', 'some_invalid_nonce');
      cerber.authorizeRequest(requestMock, nextSpy);
      expect(nextSpy).to.have.been.calledWithMatch(CerberError);
		});
		it('should be called with user data for valid request over HTTPS', function () {
			requestMock.headers.authorization.set('hash', '9b4d61ea71ba863f60501dd59d3d813c8d711a10');
			requestMock.connection.encrypted = true;
      cerber.authorizeRequest(requestMock, nextSpy);
      expect(nextSpy).to.have.been.calledWith(null, userFixture);
		});
	});
});
