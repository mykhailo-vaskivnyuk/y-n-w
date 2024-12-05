/* eslint-disable indent */
import nodemailer from 'nodemailer';
import { format } from 'node:util';
import { SentMessageInfo, MailOptions } from 'nodemailer/lib/smtp-transport';
import { TMailType } from './types';
import { TPromiseExecutor } from '../../../src/client/common/types';
import {
  MAIL_COMMON_OPTIONS,
  MAIL_OPTIONS_MAP,
  MAIL_TEMPLATE,
} from './constants';

const getMailService = (config: MailOptions) => {
  const transporter = nodemailer.createTransport(config);
  const send = (mailOptions: MailOptions) => {
    const executor: TPromiseExecutor<SentMessageInfo> = (rv, rj) => {
      const options = { ...MAIL_COMMON_OPTIONS, ...mailOptions };
      transporter.sendMail(options, (error, info) => {
        error ? rj(error) : rv(info);
      });
    };
    return new Promise(executor);
  };

  const sendMail = async (type: TMailType, to: string, token: string) => {
    const { subject, text, link: tplLink, button } = MAIL_OPTIONS_MAP[type];
    const link = format(tplLink, env.ORIGIN, token);
    const html = format(MAIL_TEMPLATE, text, link, button);
    const options = { to, subject, html };
    try {
      return await send(options);
    } catch (e) {
      logger.warn(e);
    }
  };

  const getSendMethod =
    (type: TMailType) =>
    async (to: string, token = '') =>
      sendMail(type, to, token);

  return {
    send,
    confirm: getSendMethod('confirm'),
    restore: getSendMethod('restore'),
    notify: getSendMethod('notify'),
  };
};

export default getMailService;
