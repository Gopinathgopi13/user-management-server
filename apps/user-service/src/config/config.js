const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../../../../.env'),
  });

module.exports = {
  development: {
    username: process.env.USER_DB_USER || process.env.DB_USER || 'postgres',
    password: process.env.USER_DB_PASSWORD || process.env.DB_PASSWORD || null,
    database: process.env.USER_DB_NAME || process.env.DB_NAME || 'user_db',
    host: process.env.USER_DB_HOST || process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.USER_DB_PORT || process.env.DB_PORT) || 5432,
    dialect: 'postgres',
  },
  test: {
    username: process.env.USER_DB_USER || process.env.DB_USER || 'postgres',
    password: process.env.USER_DB_PASSWORD || process.env.DB_PASSWORD || null,
    database: process.env.USER_DB_NAME_TEST || process.env.DB_NAME_TEST || 'user_db_test',
    host: process.env.USER_DB_HOST || process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.USER_DB_PORT || process.env.DB_PORT) || 5432,
    dialect: 'postgres',
  },
  production: {
    username: process.env.USER_DB_USER || process.env.DB_USER,
    password: process.env.USER_DB_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.USER_DB_NAME || process.env.DB_NAME,
    host: process.env.USER_DB_HOST || process.env.DB_HOST,
    port: Number(process.env.USER_DB_PORT || process.env.DB_PORT) || 5432,
    dialect: 'postgres',
  },
};
