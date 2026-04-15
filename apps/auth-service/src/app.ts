import express from 'express';
import cors from 'cors';
import router from './routes';
import { errorHandler, notFound } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.get('/', (_req, res) => {
  res.send('Auth Service is running');
});

app.use(notFound);
app.use(errorHandler);

export default app;
