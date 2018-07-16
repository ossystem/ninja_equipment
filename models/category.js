'use strict';

const errors = require('../utils/errors');
const helpers = require('../utils/helpers.js');

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('category', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        isUUID: 4,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      searchable: true,
      unique: {
        msg: 'Category name with the same name is already exists.',
      },
      validate: {
        notEmpty: true,
      },
    },
  });

  return Model;
};
