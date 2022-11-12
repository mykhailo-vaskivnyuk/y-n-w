import nodemailer from 'nodemailer';
import { format } from 'node:util';
import { SentMessageInfo, MailOptions } from 'nodemailer/lib/smtp-transport';
import { TMailType } from './types';
import {
  MAIL_COMMON_OPTIONS, MAIL_OPTIONS_MAP,
  MAIL_TEMPLATE,
} from './constants';
import { TPromiseExecutor } from '../../types/types';

export const getMailService = (config: MailOptions) => {
  const transporter = nodemailer.createTransport(config);

  const send = (mailOptions: MailOptions) => {
    const executor: TPromiseExecutor<SentMessageInfo> =
    (rv, rj) => {
      const options = { ...MAIL_COMMON_OPTIONS, ...mailOptions };
      transporter.sendMail(options, (error, info) => {
        error ? rj(error) : rv(info);
      });
    };
    return new Promise(executor);
  };

  const sendMail = async (
    type: TMailType,
    to: string,
    origin: string,
    token: string,
  ) => {
    const { text, subject } = MAIL_OPTIONS_MAP[type];
    const link = `${origin}/#/account/${type}/${token}`;
    const html = format(MAIL_TEMPLATE, text, link);
    const options = {
      ...MAIL_COMMON_OPTIONS,
      to,
      subject,
      html,
    };
    try {
      return await send(options);
    } catch (e) {
      logger.warn(e);
    }
  };

  return { sendMail };
};
