"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMail = exports.MailError = void 0;
const mail_1 = require("../../services/mail/mail");
class MailError extends Error {
    constructor() {
        super('Mail error');
        this.name = this.constructor.name;
    }
}
exports.MailError = MailError;
const setMail = (config) => {
    const sendMail = (0, mail_1.initMail)(config);
    const fn = (options) => {
        try {
            return sendMail(options);
        }
        catch (e) {
            logger.error(e);
            throw new MailError();
        }
    };
    return async (context, data) => {
        context.sendMail = fn;
        return [context, data];
    };
};
exports.setMail = setMail;
//# sourceMappingURL=send.mail.js.map