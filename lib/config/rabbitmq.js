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
      passive: false, // ��������queue�������ָ����ֵΪtrue֮��consumer������queue�������ɿͻ��˷�������һ��ô��ǣ��ͻ��˿���ͨ������������ж�queue�Ƿ���ڡ��������ֵ��������Ϊfalse����Ϊ����queue��consumer��ְ��
      durable: true, // �־û��������ָ��������������ʲô�ģ�queue����Ϣ��Ȼ����
      autoDelete: false, // �����ָ�������Ӷϵ�֮��ɾ��queue
      // exclusive: true // �����ָ��ֻ���ɵ�ǰ������ȥ������Ϣ����������һ�㣬��������Ӷϵ�֮��queue�ᱻ�Զ�ɾ������ʹautoDeleteΪfalseҲ��ɾ����
    }
  }
};

module.exports = exports = rabbitmq;
