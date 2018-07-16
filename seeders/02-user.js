'use strict';

const db = require('./../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const groups = await db.group.findAll();
    const groupAdmins = groups.filter(i => i.systemName === 'admins');
    const groupGuest = groups.filter(i => i.systemName === 'guest');

    // 1st user

    let userSecureData =  db.user.generateHashAndSalt('1qazXSW@');

    let user = await db.user.create({
      password_hash: userSecureData.password_hash,
      password_salt: userSecureData.password_salt,
      email: 'admin@example.com',
      name: "Admin User",
    });

    await user.setGroups(groupAdmins);

    // 2nd user

    userSecureData =  db.user.generateHashAndSalt('5d849FF3#27b48%f960&6*28ab0@5dcb');

    user = await db.user.create({
      password_hash: userSecureData.password_hash,
      password_salt: userSecureData.password_salt,
      email: 'guest@example.com',
    });

    await user.setGroups(groupGuest);

    // 3rd user

    userSecureData =  db.user.generateHashAndSalt('1');

    user = await db.user.create({
      password_hash: userSecureData.password_hash,
      password_salt: userSecureData.password_salt,
      email: 'some_user@example.com',
      name: "Developer User",
    });

    await user.setGroups(groups.filter(i => {
      return ['developers'].includes(i.systemName);
    }));
  },
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('users'),
};
