import nodemailer from 'nodemailer';
import { SentMessageInfo, MailOptions, Options } from 'nodemailer/lib/smtp-transport';

export type TMail = ReturnType<typeof initMail>;

export const initMail = (config: Options) => { 
  const transporter = nodemailer.createTransport(config);

  const sendMail = (mailOptions: MailOptions) =>
    new Promise<SentMessageInfo>((rv, rj) =>
      transporter.sendMail(mailOptions, (error, info) => {
        error ? rj(error) : rv(info);
      }),
    );

  return sendMail;
};
