import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';

export type UserStatus = 'active' | 'inactive' | 'banned';

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  status: UserStatus;
  role_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'status'>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public password_hash!: string;
  public status!: UserStatus;
  public role_id!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'banned'),
      allowNull: false,
      defaultValue: 'active',
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'roles', key: 'id' },
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  },
);

export default User;
