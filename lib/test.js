'use strict';

if (1) {
  let amqp = require('amqp'); 
  let rabbitmq = require('./config/rabbitmq');

  console.log(rabbitmq);

  let connection = amqp.createConnection(rabbitmq.connection);
  connection.on('ready', function () {
    console.log('连接ready');
    connection.queue('test-queue', {
      passive: false, // 被动创建queue。这个是指，当值为true之后，consumer不创建queue，而是由客户端发起。这有一点好处是，客户端可以通过这个参数来判断queue是否存在。不过这个值建议设置为false。因为创建queue是consumer的职责
      durable: true, // 持久化。这个是指，当服务器重启什么的，queue的消息依然会在
      autoDelete: false, // 这个是指，当连接断掉之后，删除queue
      // exclusive: true // 这个是指，只能由当前的连接去消费信息，这隐含着一点，当这个链接断掉之后，queue会被自动删除，即使autoDelete为false也会删除。
    }, function (queue) {
      console.log('创建queue');
      queue.bind('#');
      console.log('绑定#routingkey');
      queue.subscribe(function (message) { // 这步骤是建立consumer
        console.log(message.data.toString());
      });
    });
  });
}

if (0) {
  let apn = require('apn');

  // 连接
  let options = {
    cert: './config/pem/xxjia/cert_pro.pem',
    key: './config/pem/xxjia/key_pro.pem',
    port: 2195,
    production: true,
    maxConnections: 1, // 默认值1。这个是指，最大创建多少个链接数来发送信息
    connectTimeout: 10000, // 默认值为10S。这个是指
  };
  let apnConnection = new apn.Connection(options);
  //console.log(apnConnection);
    
  // 设备号
  let myDevice = new apn.Device('2aad9740b028025c8f05462e6c09e9d3a6c641e91911ec5bac448e3e2b03c62c');
  console.log(myDevice.token);

  // 消息
  let note = new apn.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 3600; 
  note.badge = 1;
  note.sound = 'ping.aiff';
  note.alert = 'test message';
  note.payload = {hello: 'world'};
  console.log(note);

  apnConnection.pushNotification(note, myDevice);
}

if (0) {
  let apn = require('apn');

  let options = {
    cert: './pem/xxjia/cert_pro.pem',
    key: './pem/xxjia/key_pro.pem',
    port: 2195,
    production: true,
    // maxConnections: 1, // 默认值1。这个是指，最大创建多少个链接数来发送信息
    // connectTimeout: 10000, // 默认值为10S。这个是指
    batchFeedback: true,
    interval: 10,
    rejectUnauthorized: true
  };

  let feedback = new apn.Feedback(options);
  // console.log(feedback);

  feedback.on('feedback', function (devices) {
    // console.log(devices);
    devices.forEach(function (item) {
      console.log(item);
    });
  });

  feedback.on('feedbackError', console.error);
}

if (0) {
  let string = "\sdfs\sdfsdf";
  console.log(string);
  let replaced = string.replace(/\\/g, '/');
  console.log(replaced);
}


if (0) {
  const PI = 3.14;
  let a = `${PI}123`;
  console.log(a);
}


if (0) {
  console.log(__dirname);
  console.log(__filename);
}

if (0) {
  var os = require('os');
  console.log(os.platform());  
}
