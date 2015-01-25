'use strict';
function nonceSearch(nonce) {
  // nonce is defined in ./authorization-header.js
  return ['11128f'].indexOf(nonce) !== -1;
}

module.exports = [{
	id: '53f1bf09d0a9371a5e11128f',
	key: '53f1bf096bab301fdcb9c0cf',
	login: 'vilmamalone@kangle.com',
	password: '53f1ca99e7724e838a599aba',
	nonce: nonceSearch
}, {
	id: '53f1ca996a04405b4c21a0bc',
	key: '53f1ca99ddb3f1188dd6e36c',
	login: 'vilmamalone@kangle.com',
	password: '53f1ca99d2b0a2f493660972',
  nonce: nonceSearch
}, {
	id: '53f1ca9910963c6b6a70dae5',
	key: '53f1ca99ffce3e4e9c0d90f8',
	login: 'vilmamalone@kangle.com',
	password: '53f1ca9932d21f2f5dd85c82',
  nonce: nonceSearch
}, {
	id: '53f1ca9945f03e8d0da215e8',
	key: '53f1ca99a463697f5a3ec6c8',
	login: 'vilmamalone@kangle.com',
	password: '53f1ca9918de9f3ea6f317f2',
  nonce: nonceSearch
}, {
	id: '53f1ca993ec048b8df67c6da',
	key: '53f1ca99c0d36aabc18a7cfb',
	login: 'vilmamalone@kangle.com',
	password: '53f1ca993d4c7535c246f039',
  nonce: nonceSearch
}];
