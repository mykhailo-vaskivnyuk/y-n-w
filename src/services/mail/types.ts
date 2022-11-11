import { SentMessageInfo } from 'nodemailer';

export type TMailType = keyof IMailService['sendMail'];

export interface IMailService {
  sendMail: {
    confirm: (
      to: string, origin: string, token: string,
    ) => Promise<SentMessageInfo>;
    restore: (
      to: string, origin: string, token: string,
    ) => Promise<SentMessageInfo>;
  };
}
