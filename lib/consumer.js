'use strict';

let amqp = require('amqp');

class Consumer {

  // constructor
  constructor(mqConfig) {
    this.mqConfig = mqConfig;
  }

  // connect a queue
  connect() {
    let connection = amqp.createConnection(this.mqConfig);
    connection.on('ready', function () {

    });
  }

  // consume a msg from rabbitmq
  consume() {

  }

  // wrap a msg
  wrapMsg() {

  }

  // send a msg to Appleh Push Notification Server 
  sendMsg() {

  }

}

module.exports = exports = Consumer;
