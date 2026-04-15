import { createLogger, format, transports } from 'winston';

const { combine, timestamp, colorize, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`);

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), colorize(), logFormat),
  transports: [new transports.Console()],
});

export default logger;
