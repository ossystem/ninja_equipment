'use strict';

const merge = require('deepmerge');

const configDev = require('../config.dev.json');
const configProd = require('../config.prod.json');

let config = (process.env.NODE_ENV !== 'production') ? configDev : configProd;

// Override main config (config.json) with potential local config (config.local.json): that's
// useful when deploying the app on a server with different server url and port (Ext.Direct).
try {
  config = merge(config, require('../config.local.json'));
} catch (e) {}

module.exports = config;
