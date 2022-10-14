
import { TModule } from '../types';
import { initMail } from '../../services/mail/mail';
import { Options, MailOptions } from 'nodemailer/lib/smtp-transport';

export class MailError extends Error {
  constructor() {
    super('Mail error');
    this.name = this.constructor.name;
  }
}

export const setMail: TModule<MailOptions> = (config) =>
  async (context, data) => {
    const sendMail = initMail(config);
    context.sendMail = (options: Options) => {
      try {
        return sendMail(options);
      } catch (e: any) {
        logger.error(e);
        throw new MailError();
      }
    };
    return [context, data];
  };
