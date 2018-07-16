'use strict';

const db = require('./../models');

const data = [
  {
    name: 'Admins',
    systemName: 'admins',
    allows: [
      { resources: 'order', permissions: ['post'] },
      { resources: 'product', permissions: ['post', 'get'] },
    ],
  },
  {
    name: 'Developers',
    systemName: 'developers',
    allows: [
      { resources: 'order', permissions: ['put'] },
      { resources: 'product', permissions: ['post', 'get'] },
    ],
  },
  {
    name: 'Guest',
    systemName: 'guest',
    allows: [
      { resources: 'register', permissions: ['post'] },
      { resources: 'login', permissions: ['post'] },
    ],
  },
];
module.exports = {
  up: async () => {
    await db.group.bulkCreate(data);

    const permissionsArray = data.map((item) => {
      return {
        roles: item.systemName,
        allows: item.allows,
      };
    });

    await db.acl.allow(permissionsArray, () => {
      console.log('groups added');
    });
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('groups');
    const promises = [];
    data.forEach((group) => {
      group.allows.forEach((allow) => {
        promises.push(db.acl.removeAllow(group.systemName, allow.resources, allow.permissions));
      });
    });

    await Promise.all(promises).then(() => {
      console.log('groups removed');
    });
  },
};
