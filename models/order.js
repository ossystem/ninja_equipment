'use strict';

const errors = require('../utils/errors');
const helpers = require('../utils/helpers.js');
const mail = require('../utils/mail.js');

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('order', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        isUUID: 4,
      },
    }
  });
  
  Model.associate = (models) => {
    Model.belongsTo(models.user, { foreignKey: 'user_id' });
    Model.belongsTo(models.product, { foreignKey: 'product_id' });
    Model.afterCreate(async order => {
      const data = await models.order.findOne({
        where: { id: order.id },
        include: [{
          model: models.user,
          as: 'user',
          attributes: ['name', 'email'],
        },{
            model: models.product,
            as: 'product',
            attributes: ['name', 'price'],
        }]
      });
      mail.send([data.user.email], 'New order', `Hello ${data.user.name}! You have bought a ${data.product.name} for ${data.product.price} ninjollars.`);
    });
  };

  return Model;
};