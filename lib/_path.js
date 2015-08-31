'use strict';

let os = require('os');

const ROOT = os.platform() === 'linux' ? __dirname + '/../' : __dirname.replace(/\\/g, '/') + '/../';

let path = new Map();

// root dir
path.set('root', ROOT);

// codes dir
path.set('lib', ROOT + '/lib');

// config dir
path.set('config', ROOT + '/config');

// temp dir
path.set('tmp', ROOT + '/tmp');

// pem dir
path.set('pem', ROOT + '/pem');

module.exports = exports = path;
