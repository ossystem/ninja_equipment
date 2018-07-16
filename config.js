'use strict';

const path = require('path');

const config = require(path.join(__dirname, 'utils', 'config.js')).database;

module.exports = {
  development: {
    username: config.username,
    password: config.password,
    database: config.database,
    host: config.host,
    dialect: config.dialect,
    define: config.define,
    dialectOptions: {"requestTimeout": 50000},
    pool: {"max": 1, "idle": 50000},
  },
  test: {
    username: config.username,
    password: config.password,
    database: config.database,
    host: config.host,
    dialect: config.dialect,
    define: config.define,
    dialectOptions: {"requestTimeout": 50000},
    pool: {"max": 1, "idle": 50000},
  },
  production: {
    username: config.username,
    password: config.password,
    database: config.database,
    host: config.host,
    dialect: config.dialect,
    define: config.define,
    dialectOptions: {"requestTimeout": 50000},
    pool: {"max": 1, "idle": 50000},
  },
};
