import sequelize from '@config/database';
import User from './user.model';
import Role from './role.model';

// Associations
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });

export { sequelize, User, Role };
