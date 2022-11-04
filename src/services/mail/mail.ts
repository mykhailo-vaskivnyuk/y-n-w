import nodemailer from 'nodemailer';
import { format } from 'node:util';
import { SentMessageInfo, MailOptions } from 'nodemailer/lib/smtp-transport';
import { TMailType } from '../../router/types';
import { generalOptions, OPTIONS_MAP, template } from './constants';

export const getMailService = (config: MailOptions) => { 
  const transporter = nodemailer.createTransport(config);

  const send = (mailOptions: MailOptions) =>
    new Promise<SentMessageInfo>((rv, rj) => {
      const options = { ...generalOptions, ...mailOptions };
      transporter.sendMail(options, (error, info) => {
        error ? rj(error) : rv(info);
      });
    });

  const sendMail = (type: TMailType, to: string, origin: string, token: string) => {
    const { text, subject } = OPTIONS_MAP[type];
    const link = `${origin}/#/account/${type}/${token}`;
    const html = format(template, text, link);
    const options = {
      ...generalOptions,
      to,
      subject,
      html,
    };
    return send(options);
  };

  return { sendMail };
};
