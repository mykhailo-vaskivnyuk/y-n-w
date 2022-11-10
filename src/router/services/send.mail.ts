
import { MailOptions } from 'nodemailer/lib/smtp-transport';
import { TMailType } from '../types';
import { getMailService } from '../../services/mail/mail';

export class MailError extends Error {
  constructor() {
    super('Mail error');
    this.name = this.constructor.name;
  }
}

const createMailServiceMethods = (config: MailOptions) => {
  const { sendMail } = getMailService(config);

  const createSendMethod = (type: TMailType) =>
    async (to: string, origin: string, token: string) => {
      try {
        return await sendMail(type, to, origin, token);
      } catch (e: any) {
        logger.error(e);
      }
    };

  return {
    sendMail: {
      confirm: createSendMethod('confirm'),
      restore: createSendMethod('restore'),
    },
  };
};

export default createMailServiceMethods;
