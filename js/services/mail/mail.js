"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_util_1 = __importDefault(require("node:util"));
const template = node_fs_1.default.readFileSync('src/services/mail/template.html').toString();
const generalOptions = { from: 'm.vaskivnyuk@gmail.com', sender: 'You & World' };
const OptionsMap = {
    confirm: {
        text: 'Якщо ви реєструвалсь на сайті You &amp; World - підтвердіть свій email. Для цього клікніть на лінк нижче.',
        subject: 'Confirm email on You & World',
    },
    restore: {
        text: 'Якщо ви хочете увійти на сайт You &amp; World - клікніть на лінк нижче.',
        subject: 'Login into You & World',
    }
};
const initMail = (config) => {
    const transporter = nodemailer_1.default.createTransport(config);
    const send = (mailOptions) => new Promise((rv, rj) => {
        const options = { ...generalOptions, ...mailOptions };
        transporter.sendMail(options, (error, info) => {
            error ? rj(error) : rv(info);
        });
    });
    const sendMail = (type, origin, to, token) => {
        const { text, subject } = OptionsMap[type];
        const link = `${origin}/#/account/${type}/${token}`;
        const html = node_util_1.default.format(template, text, link);
        const options = {
            ...generalOptions,
            to,
            subject,
            html,
        };
        return send(options);
    };
    return { sendMail };
};
exports.initMail = initMail;
//# sourceMappingURL=mail.js.map