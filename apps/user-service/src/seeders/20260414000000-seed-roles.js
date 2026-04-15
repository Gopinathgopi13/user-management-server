'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('roles', [
      {
        id: 'a1b2c3d4-0001-0001-0001-000000000001',
        name: 'admin',
        permissions: JSON.stringify({ users: ['read', 'write', 'delete'], roles: ['read', 'write', 'delete'] }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'a1b2c3d4-0002-0002-0002-000000000002',
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
