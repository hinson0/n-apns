'use strict';

var push = {
  gateway: 'gateway.push.apple.com',
  port: 2195,
  pems: {
    xxjia: {
      cert: `${__dirname}/pem/xxjia/cert_pro.pem`,
      key: `${__dirname}/pem/xxjia/key_pro.pem`
    }
  }
};

module.exports = exports = push;
