import nodemailer from 'nodemailer';
import fs from 'node:fs';
import util from 'node:util';
import { SentMessageInfo, MailOptions } from 'nodemailer/lib/smtp-transport';
import { TMailType } from '../../router/types';

const template = fs.readFileSync('src/services/mail/template.html').toString();
const generalOptions = { from: 'm.vaskivnyuk@gmail.com', sender: 'You & World' };
const OptionsMap = {
  confirm: {
    text: 'Якщо ви реєструвалсь на сайті You &amp; World - підтвердіть свій email. Для цього клікніть на лінк нижче.',
    subject: 'Confirm email on You & World',
  },
  restore: {
    text: 'Якщо ви хочете увійти на сайт You &amp; World - клікніть на лінк нижче.',
    subject: 'Login into You & World',
  }
}
export const initMail = (config: MailOptions) => { 
  const transporter = nodemailer.createTransport(config);

  const send = (mailOptions: MailOptions) =>
    new Promise<SentMessageInfo>((rv, rj) => {
      const options = { ...generalOptions, ...mailOptions };
      transporter.sendMail(options, (error, info) => {
        error ? rj(error) : rv(info);
      });
    });

  const sendMail = (type: TMailType, origin: string, to: string, token: string) => {
    const { text, subject } = OptionsMap[type];
    const link = `${origin}/#/account/${type}/${token}`;
    const html = util.format(template, text, link);
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
