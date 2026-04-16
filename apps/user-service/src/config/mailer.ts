import nodemailer from 'nodemailer';
import config from './index';

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: config.mail.secure,
  auth: {
    user: config.mail.username,
    pass: config.mail.password,
  },
});

export const MAIL_FROM = `"User Management" <${config.mail.address}>`;

export default transporter;
