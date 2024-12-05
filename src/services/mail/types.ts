import { SentMessageInfo } from 'nodemailer';

export type TMailType = 'restore' | 'confirm' | 'notify';

export interface IMailService {
  send: () => Promise<SentMessageInfo>;
  confirm: (to: string, token: string) => Promise<SentMessageInfo>;
  restore: (to: string, token: string) => Promise<SentMessageInfo>;
  notify: (to: string) => Promise<SentMessageInfo>;
}
