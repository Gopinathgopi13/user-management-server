import app from './app';
import config from '@config';
import logger from '@utils/logger';
import { sequelize } from '@models';

const start = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');
    await sequelize.sync({ alter: false });

    app.listen(config.port, () => {
      logger.info(`Auth service running on port ${config.port}`);
    });
  } catch (err) {
    logger.error(`Startup error: ${err}`);
    process.exit(1);
  }
};

start();
