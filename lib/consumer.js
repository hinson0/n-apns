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
  getMsg(queue) {
    //return new Promise(function (resolve, reject) {
      queue.subscribe(function (message) {
        console.log(message.data.toString());
        //resolve(message.data.toString());
      //});
    });
  }

  // wrap a msg
  wrapAPNsMsg(msg) {
    winston.info(msg);

    // check msg
    if (!msg) {
      winston.info('msg is empty.');
      return;
    }

    console.log(msg);
    //try {
    //  let json = JSON.parse(msg);
    //  console.log(json);
    //  console.log(typeof json);
    //} catch (err) {
    //  winston.error(err);
    //  return;
    //}



    if (typeof msg === '') {

    }

    // warp a msg
    let note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600;
    note.badge = 1;
    note.sound = 'ping.aiff';
    note.alert = msg;
    note.payload = {hello: 'world'};

    return note;
  }

  // send a msg to Appleh Push Notification Server 
  sendToAPNs(note) {
    winston.info('send a msg to apns');

    // connection map
    //let connections = this.getApnConnections();

    // send
    //if (1) {
    //
    //}


    //for (let value of connections) {
    //  let myDevice = new apn.Device('2aad9740b028025c8f05462e6c09e9d3a6c641e91911ec5bac448e3e2b03c62c');
    //  let apnConnection = value[1];
    //  apnConnection.pushNotification(note, myDevice);
    //  winston.info(`app ${value[0]} push a msg to apns, device token is ${myDevice}, msg is ${note}`);
    //}
  }

  // get an apn connection in map
  getApnConnections() {
    let connections = new Map();
    let apnConfig = require('./config/apn');
    for (let value of apnConfig.get('pems')) {
      if (connections.has(value[0])) {
        winston.info(`app ${value[0]} already existed`);
        return;
      }
      let pem = value[1];
      let options = apnConfig.get('options');
      options.cert = pem.cert;
      options.key = pem.key;
      let apnConnection = new apn.Connection(apnConfig.options);
      connections.set(value[0], apnConnection);

      winston.info(`app ${value[0]}'s config is ${JSON.stringify(options)}`);
    }
    return connections;
  }


}

// an usage about Consumer with co & Promise
co(function *() {
  let rabbitmq = require('./config/rabbitmq');
  let consumer = new Consumer(rabbitmq);
  let connection = yield consumer.connect();
  let exchange = yield consumer.createExchange(connection);
  let queue = yield consumer.createQueue(connection, exchange);
  let msg = consumer.getMsg(queue);
  //let wrapedMsg = consumer.wrapAPNsMsg(msg);
  //consumer.sendToAPNs(wrapedMsg);

  //console.log(msg);
}).catch(function (err) {
  console.error('co catch error');
  console.error(err.stack);
});

module.exports = exports = Consumer;
