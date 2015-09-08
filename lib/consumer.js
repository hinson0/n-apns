'use strict';

let amqp = require('amqp');
let co = require('co');
let winston = require('winston');
let apn = require('apn');

class Consumer {

  // constructor
  constructor(mqConfig) {
    this.mqConfig = mqConfig;
  }

  // connect to rabbitmq
  connect() {
    let connection = amqp.createConnection(this.mqConfig.connection);
    return new Promise(function (resolve, reject) {
      connection.on('ready', function () {
        resolve(connection);
      });
    });
  }

  // create an exchange
  createExchange(connection) {
    return new Promise(function (resolve, reject) {
      connection.exchange('APNs', {
        type: 'topic',
        autoDelete: false,
      }, function (exchange) {
        resolve(exchange);
      });
    });
  }

  // create a queue
  createQueue(connection, exchange) {
    let self = this;
    return new Promise(function (resolve, reject) {
      connection.queue(self.mqConfig.queue.name, self.mqConfig.queue.options, function (queue) {
        queue.bind(exchange, '#apns#');
        resolve(queue);
      });
    });
  }

  // consume a msg from rabbitmq
  getMsg(msg) {
    let msgString = msg.data.toString('utf8');

    winston.info(`msg is ${msgString}`);

      let json = JSON.parse(msgString);

      if (typeof msg !== 'object') {
        return Promise.reject(new Error(`invalid msg ${msgString}`));
      }
      if (!json.app) {
        return Promise.reject(new Error('app is empty'));
      }
      if (!json.device_tokens) {
        return Promise.reject(new Error('device token is empty'));
      }
      return Promise.resolve(json);
  }

  // wrap a msg
  msg2note(msg) {
    let note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600;
    note.badge = 1;
    note.sound = 'ping.aiff';
    note.alert = msg.alert;
    note.payload = msg.data;

    // check note length(max length is 1024 types)
    let noteString = JSON.stringify(note);
    let length = Buffer.byteLength(noteString, 'utf8');
    if (length < 1024) {
      return Promise.reject(new Error(`payload ${noteString} is too long`));
    } else {
      return Promise.resolve(note);
    }
  }

  // send a msg to Appleh Push Notification Server 
  sendToAPNs(app, device_tokens, note) {
    winston.info('send a msg to apns');
    // connection map
    let connections = this.getApnConnections();

    // check connection
    if (!connections.has(app)) {
      winston.error(`please configure app ${app}.`);
      return;
    }

    // device
    device_tokens.forEach(function (device_token) {
      // device
      let device = new apn.Device(device_token);

      // send
      //connections.get(app).pushNotification(note, device);

      winston.info(`app ${app} push a payload to APNs, token is ${device}, payload is ${note.compiled}`);
    });
  }

  // get an apn connection in map
  getApnConnections() {
    let connections = new Map();
    let apnConfig = require('./config/apn');
    for (let value of apnConfig.get('pems')) {
      if (connections.has(value[0])) {
        winston.info(`app ${value[0]} already existed`);
        continue;
      }
      let pem = value[1];
      let options = apnConfig.get('options');
      options.cert = pem.cert;
      options.key = pem.key;
      let apnConnection = new apn.Connection(options);
      connections.set(value[0], apnConnection);

      winston.info(`app ${value[0]}'s config is ${JSON.stringify(options)}`);
    }
    return connections;
  }

}

// an usage about Consumer with co
co(function *() {
  let rabbitmq = require('./config/rabbitmq');
  let consumer = new Consumer(rabbitmq);
  let connection = yield consumer.connect();
  let exchange = yield consumer.createExchange(connection);
  let queue = yield consumer.createQueue(connection, exchange);
  queue.subscribe(function (message) {
    co(function *() {
      let msg = yield consumer.getMsg(message);
      let note = yield consumer.msg2note(msg);
      consumer.sendToAPNs(msg.app, msg.device_tokens, note);
    }).catch(function (err) {
      console.error('co catch error, queue subscribe');
      console.error(err.stack);
    });
  });
}).catch(function (err) {
  console.error('co catch error');
  console.error(err.stack);
});

module.exports = exports = Consumer;
