"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailError = void 0;
const mail_1 = require("../../services/mail/mail");
class MailError extends Error {
    constructor() {
        super('Mail error');
        this.name = this.constructor.name;
    }
}
exports.MailError = MailError;
const setMailService = (config) => {
    const { sendMail } = (0, mail_1.initMail)(config);
    const create = (origin, type) => async (to, token) => {
        try {
            return await sendMail(type, origin, to, token);
        }
        catch (e) {
            logger.error(e);
            throw new MailError();
        }
    };
    return async (operation, context) => {
        const { origin } = context;
        context.sendMail = {
            confirm: create(origin, 'confirm'),
            restore: create(origin, 'restore'),
        };
        return [operation, context];
    };
};
exports.default = setMailService;
//# sourceMappingURL=send.mail.js.map