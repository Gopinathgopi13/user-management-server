'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'admin' LIMIT 1`
    );
    const admin_role_id = roles[0]?.id;
    if (!admin_role_id) throw new Error('admin role not found. Run role seeders first.');

    const [managerRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'manager' LIMIT 1`
    );
    const manager_role_id = managerRole[0]?.id;
    if (!manager_role_id) throw new Error('manager role not found. Run role seeders first.');

    const [userRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'user' LIMIT 1`
    );
    const user_role_id = userRole[0]?.id;
    if (!user_role_id) throw new Error('user role not found. Run role seeders first.');

    const password_hash = await bcrypt.hash('Admin@123', 12);
    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        name: 'Admin',
        email: 'admin@example.com',
        password_hash,
        status: 'active',
        role_id: admin_role_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Manager',
        email: 'manager@example.com',
        password_hash,
        status: 'active',
        role_id: manager_role_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'User',
        email: 'user@example.com',
        password_hash,
        status: 'active',
        role_id: user_role_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@example.com' }, {});
  },
};
