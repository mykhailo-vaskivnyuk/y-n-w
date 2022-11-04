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
const createMailServiceMethods = (config) => {
    const { sendMail } = (0, mail_1.getMailService)(config);
    const createSendMethod = (type) => async (to, origin, token) => {
        try {
            return await sendMail(type, to, origin, token);
        }
        catch (e) {
            logger.error(e, e.message);
        }
    };
    return {
        sendMail: {
            confirm: createSendMethod('confirm'),
            restore: createSendMethod('restore'),
        },
    };
};
exports.default = createMailServiceMethods;
//# sourceMappingURL=send.mail.js.map