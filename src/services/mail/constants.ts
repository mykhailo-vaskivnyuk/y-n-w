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
    text: `Якщо ви реєструвалсь на сайті You &amp; World -
      підтвердіть свій email. Для цього клікніть на лінк нижче.`,
    subject: 'Confirm email on You & World',
  },
  restore: {
    text: `Якщо ви хочете увійти на сайт You &amp; World -
      клікніть на лінк нижче.`,
    subject: 'Login into You & World',
  },
};
