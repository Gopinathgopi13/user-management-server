import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';

interface RoleAttributes {
  id: string;
  name: string;
  permissions: Record<string, string[]>;
  createdAt?: Date;
  updatedAt?: Date;
}

type RoleCreationAttributes = Optional<RoleAttributes, 'id' | 'permissions'>;

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: string;
  public name!: string;
  public permissions!: Record<string, string[]>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    permissions: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: true,
  },
);

export default Role;
