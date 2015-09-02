'use strict';

var rabbitmq = {
  connection: {
    host: '192.168.64.38',
    port: 5672,
    login: 'yzb',
    password: '123456',
    vhost: '/',
  },
  exchange: {
    defaultExchangeName: 'APNs'
  },
  queue: {
    name: 'apns',
    options: {
      passive: false, // 被动创建queue。这个是指，当值为true之后，consumer不创建queue，而是由客户端发起。这有一点好处是，客户端可以通过这个参数来判断queue是否存在。不过这个值建议设置为false。因为创建queue是consumer的职责
      durable: true, // 持久化。这个是指，当服务器重启什么的，queue的消息依然会在
      autoDelete: false, // 这个是指，当连接断掉之后，删除queue
      // exclusive: true // 这个是指，只能由当前的连接去消费信息，这隐含着一点，当这个链接断掉之后，queue会被自动删除，即使autoDelete为false也会删除。
    }
  }
};

module.exports = exports = rabbitmq;
