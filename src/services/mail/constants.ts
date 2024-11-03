import fs from 'node:fs';

export const MAIL_TEMPLATE = fs
  .readFileSync('src/services/mail/mail.template.html')
  .toString();
export const MAIL_COMMON_OPTIONS = {
  from: 'm.vaskivnyuk@gmail.com',
  sender: 'You & World',
};
export const MAIL_OPTIONS_MAP = {
  confirm: {
    subject: 'Confirm email on You & World',
    text: `Якщо ви реєструвалсь на сайті You &amp; World -
      підтвердіть свій email. Для цього клікніть на лінк нижче.`,
    link: '%s/#/account/confirm/%s',
    button: 'Підтвердити',
  },
  restore: {
    subject: 'Login into You & World',
    text: `Якщо ви хочете увійти на сайт You &amp; World -
      клікніть на лінк нижче.`,
    link: '%s/#/account/restore/%s',
    button: 'Увійти',
  },
  notify: {
    subject: 'New events on You & World',
    text: `На сайті You &amp; World нові події.
      Щоб переглянути їх - клікніть на лінк ниже`,
    link: '%s/#/%s',
    button: 'Увійти',
  },
};
