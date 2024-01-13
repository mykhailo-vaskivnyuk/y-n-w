import { SentMessageInfo } from 'nodemailer';

export type TMailType = 'restore' | 'confirm';

export interface IMailService {
    send: () => Promise<SentMessageInfo>;
    confirm: (
      to: string, origin: string, token: string,
    ) => Promise<SentMessageInfo>;
    restore: (
      to: string, origin: string, token: string,
    ) => Promise<SentMessageInfo>;
}
