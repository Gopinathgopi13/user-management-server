'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const password_hash = await bcrypt.hash('Admin@123', 12);
    await queryInterface.bulkInsert('users', [
      {
        id: 'b2c3d4e5-0001-0001-0001-000000000001',
        name: 'Super Admin',
        email: 'admin@example.com',
        password_hash,
        status: 'active',
        role_id: 'a1b2c3d4-0001-0001-0001-000000000001',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@example.com' }, {});
  },
};
