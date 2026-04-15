import express from 'express';
import cors from 'cors';
import config from './config';
import logger from './utils/logger';
import routes from './routes';
import { errorHandler, notFound } from './middlewares/error.middleware';

const app = express();

app.use(cors());

// Request logger
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.use(routes);

app.get('/', (_req, res) => res.send('API Gateway is running'));

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`API Gateway running on port ${config.port}`);
});
