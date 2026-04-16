import express from 'express';
import cors from 'cors';
import router from './routes';
import config from '@config';
import logger from '@shared/logger';
import { sequelize } from '@models';
import { notFound, errorHandler } from '@shared/middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.get('/', (_req, res) => {
  res.send('Auth Service is running');
});

app.use(notFound);
app.use(errorHandler);

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

export default app;
