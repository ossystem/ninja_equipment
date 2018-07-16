'use strict';

const db = require('./../models')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return db.category.bulkCreate([
      {
        id: '97f62094-cead-4017-ad8f-6195fca231af',
        name: 'Uniforms'
      },
      {
        id: '31f48685-665b-44bc-92ab-0cfe1a2f1788',
        name: 'Weapons'
      },
      {
        id: '16986708-b0ff-48b0-a109-3327d3f41e4d',
        name: 'Ninja gear'
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('categories');
  }
};