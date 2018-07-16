'use strict';

const models = require('../models');
const { sequelize } = models;

module.exports = {
  reset(force = false) {
    console.info('Populating database with example data...');
    return sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
    .then(()=> sequelize.sync({ force, logging: console.log }))
    .then(()=> sequelize.query('SET FOREIGN_KEY_CHECKS = 1'))
    .then(
      () => {
        console.info('Populating database: DONE');
      },
      (err) => {
        console.error('Populating database: ERROR\n', err);
      }
    );
  },
};
