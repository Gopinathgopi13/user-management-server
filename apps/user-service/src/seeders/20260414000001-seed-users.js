'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'admin' LIMIT 1`
    );
    const role_id = roles[0]?.id;
    if (!role_id) throw new Error('admin role not found. Run role seeders first.');

    const password_hash = await bcrypt.hash('Admin@123', 12);
    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        name: 'Admin',
        email: 'admin@example.com',
        password_hash,
        status: 'active',
        role_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@example.com' }, {});
  },
};
