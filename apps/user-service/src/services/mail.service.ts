import transporter, { MAIL_FROM } from '@config/mailer';
import { welcomeTemplate } from '@templates/welcome.template';
import { otpTemplate } from '@templates/otp.template';
import { newPasswordTemplate } from '@templates/new-password.template';
import logger from '@utils/logger';

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

export const sendOtpMail = async (name: string, email: string, otp: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: email,
      subject: 'Password Reset OTP',
      html: otpTemplate(name, otp),
    });
    logger.info(`OTP email sent to ${email}`);
  } catch (err) {
    logger.error(`Failed to send OTP email to ${email}: ${(err as Error).message}`);
    throw err;
  }
};

export const sendNewPasswordMail = async (name: string, email: string, password: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: email,
      subject: 'Your new password',
      html: newPasswordTemplate(name, password),
    });
    logger.info(`New password email sent to ${email}`);
  } catch (err) {
    logger.error(`Failed to send new password email to ${email}: ${(err as Error).message}`);
    throw err;
  }
};
