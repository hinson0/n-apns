'use strict';

let apn = new Map();

// options
apn.set('options', {
  gateway: 'gateway.push.apple.com',
  port: 2195,
  production: true,
  maxConnections: 1,
  connectTimeout: 10000,
});

// pems
let pems = new Map();
apn.set('pems', pems);
pems.set('xxjia', {
  cert: `${__dirname}/pem/xxjia/cert_pro.pem`,
  key: `${__dirname}/pem/xxjia/key_pro.pem`
});
pems.set('xxjia1', {
  cert: `${__dirname}/pem/xxjia/cert_pro.pem`,
  key: `${__dirname}/pem/xxjia/key_pro.pem`
});

module.exports = exports = apn;
