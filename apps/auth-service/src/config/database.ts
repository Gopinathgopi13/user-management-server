import { Sequelize } from 'sequelize';
import config from './index';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  username: config.db.username,
  password: config.db.password,
  logging: false,
});

export default sequelize;
