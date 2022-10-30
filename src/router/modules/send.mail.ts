
import { TMailType, TModule } from '../types';
import { initMail } from '../../services/mail/mail';
import { MailOptions } from 'nodemailer/lib/smtp-transport';

export class MailError extends Error {
  constructor() {
    super('Mail error');
    this.name = this.constructor.name;
  }
}

export const setMailService: TModule = (config: MailOptions) => {
  const { sendMail } = initMail(config);

  const create = (origin: string, type: TMailType) => async (to: string, token: string) => {
    try {
      return await sendMail(type, origin, to, token);
    } catch (e: any) {
      logger.error(e);
      throw new MailError();
    }
  };

  return async (context, operation) => {
    const { origin } = context;
    context.sendMail = {
      confirm: create(origin, 'confirm'),
      restore: create(origin, 'restore'),
    };
    return [context, operation];
  };
};
