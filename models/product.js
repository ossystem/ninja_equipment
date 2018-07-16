'use strict';

const errors = require('../utils/errors');
const helpers = require('../utils/helpers.js');

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('product', {
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
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
      },
    },
    description: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
  });
  
  Model.associate = (models) => {
    Model.belongsTo(models.category, {
      foreignKey: 'category_id',
      as: 'category'
    });
  };

  return Model;
};
