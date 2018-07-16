'use strict';

const errors = require('../utils/errors');
const helpers = require('../utils/helpers.js');

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('group', {
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
    },
    systemName: {
      type: DataTypes.STRING,
      allowNull: false,
      searchable: true,
      unique: {
        msg: 'A group with this name already exists.',
      },
      validate: {
        notEmpty: true,
      },
    },
    allows: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        return helpers.jsonGetter.call(this, 'allows');
      },
    }
  });

  Model.associate = (models) => {
    Model.belongsToMany(models.user, {
      as: 'users',
      through: models.user_group,
      foreignKey: 'group_id',
    });
  };

  return Model;
};
