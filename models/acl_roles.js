'use strict';

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('acl_roles', {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    value: {
      type: DataTypes.TEXT('long')
    },
  });

  return Model;
};
