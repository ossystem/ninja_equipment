'use strict';

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('user_group', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        isUUID: 4,
      },
    },
  }, {
    hooks: {
      afterBulkCreate: async (instances, options) => {
        const models = require('./index');
        const groups = await models.group.findAll();
        const promises = [];
        instances.forEach((instance) => {
          const group = groups.filter(i => i.id === instance.group_id)[0];
          promises.push(
            models.acl.addUserRoles(instance.user_id, group.systemName)
          );
        });

        await Promise.all(promises);
      },
      afterBulkDestroy: async (options) => {
        const models = require('./index');
        const groups = await models.group.findAll();
        const promises = [];
        const userId = options.where.user_id;
        const groupId = options.where.group_id;

        if (!groupId) {
          await models.acl.userRoles(userId).then((usersRoles) => {
            usersRoles.forEach((group) => {
              promises.push(
                models.acl.removeUserRoles(userId, group)
              );
            });

            Promise.all(promises);
          });
        } else {
          groupId.forEach((item) => {
            const group = groups.filter(i => i.id === item)[0];
            promises.push(
              models.acl.removeUserRoles(userId, group.systemName)
            );
          });

          await Promise.all(promises);
        }
      },
    },
  });

  return Model;
};
