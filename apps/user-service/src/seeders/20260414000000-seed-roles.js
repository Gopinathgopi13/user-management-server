'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('roles', [
      {
        id: uuidv4(),
        name: 'admin',
        permissions: JSON.stringify({
          users: ['read', 'create', 'update', 'delete'],
          roles: ['read', 'create', 'update', 'delete'],
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'manager',
        permissions: JSON.stringify({
          users: ['read', 'create', 'update', 'delete'],
          roles: ['read', 'create', 'update', 'delete'],
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'user',
        permissions: JSON.stringify({ users: ['read'] }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
