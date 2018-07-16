'use strict';

const helpers = require('../utils/helpers.js');
const crypto = require('crypto');
const models = require('./index');

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        isUUID: 4,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      searchable: true,
      unique: {
        msg: 'This email is already taken.',
      },
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      searchable: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    password_salt: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }
  });

  Model.associate = (models) => {
    Model.belongsToMany(models.group, {
      as: 'groups',
      through: models.user_group,
      foreignKey: 'user_id',
    });
  };

  // Class methods
  Model.generateHashAndSalt = function (password) {
    if (!password) {
      return {
        password_hash: null,
        password_salt: null
      };
    }

    const salt = crypto.randomBytes(64).toString('hex').slice(0, 64);
    const cryptedPassword = crypto.createHmac('sha512', salt).update(password).digest('hex');

    return {
      password_hash: cryptedPassword,
      password_salt: salt
    };
  };

  // Instance methods
  Model.prototype.isValidPassword = function (password) {
    if (!this.password_hash || !this.password_salt) {
      return false;
    }

    const cryptedPassword = crypto.createHmac('sha512', this.password_salt).update(password).digest('hex');

    return this.password_hash === cryptedPassword;
  };

  Model.prototype.toJSON = function () {
    const values = { ...this.dataValues };

    if (values.password_hash) {
      delete values.password_hash;
    }

    if (values.password_salt) {
      delete values.password_salt;
    }

    return values;
  };

  return Model;
};
