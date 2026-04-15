import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import router from './routes';
import config from '@config';
import logger from '@utils/logger';
import { sequelize } from './models';
import { errorHandler, notFound } from './middlewares/error.middleware';

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

app.set('io', io);

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.get('/', (_req, res) => {
  res.send('User Service is running');
});

app.use(notFound);
app.use(errorHandler);

io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);
  socket.join('admins');

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

const start = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');
    await sequelize.sync({ alter: false });

    server.listen(config.port, () => {
      logger.info(`User service running on port ${config.port}`);
    });
  } catch (err) {
    logger.error(`Startup error: ${err}`);
    process.exit(1);
  }
};

start();
