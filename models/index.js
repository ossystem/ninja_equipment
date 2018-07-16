'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const Acl = require('acl');
const AclSeq = require('acl-sequelize');
const config = require(path.join(__dirname, '..', 'utils', 'config')).database;
const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config.database, config.username, config.password, config);
const acl = new Acl(new AclSeq(sequelize, { prefix: 'acl_' }));
const db = {};

fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.acl = acl;

module.exports = db;
