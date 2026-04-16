import transporter, { MAIL_FROM } from '@shared/mailer';
import { welcomeTemplate } from '@templates/welcome.template';
import logger from '@shared/logger';

export const sendWelcomeMail = async (name: string, email: string, password: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: email,
      subject: 'Welcome! Your account has been created',
      html: welcomeTemplate(name, email, password),
    });
    logger.info(`Welcome email sent to ${email}`);
  } catch (err) {
    logger.error(`Failed to send welcome email to ${email}: ${(err as Error).message}`);
    throw err;
  }
};
