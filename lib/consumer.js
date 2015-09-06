'use strict';

let amqp = require('amqp');

class Consumer {

  // constructor
  constructor(mqConfig) {
    this.mqConfig = mqConfig;
  }

  // connect a queue
  connect() {
    let connection = amqp.createConnection(this.mqConfig.connection);
    let self = this;
    connection.on('ready', function () {
      console.log('ready');

      connection.exchange('APNs', function (exchange) {
        console.log(`exchangename is ${exchange.name}`);

        connection.queue(self.mqConfig.queue.name, self.mqConfig.queue.options, function (queue) {
          queue.bind(exchange, '#');

          queue.subscribe(function (message) {
            console.log(message.data.toString());
          });
        });
      });;

      //connection.queue(self.mqConfig.queue.name, self.mqConfig.queue.options, function (queue) {
      //  console.log('connection queue');
      //
      //  // bind router key
      //  queue.bind('#');
      //
      //  // subscribe a queue => consumer
      //  queue.subscribe(function (message) {
      //    console.log(message.data.toString());
      //  });
      //});
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

let rabbitmq = require('./config/rabbitmq');
let consumer1 = new Consumer(rabbitmq);
consumer1.connect();

module.exports = exports = Consumer;
