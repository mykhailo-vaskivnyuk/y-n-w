"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const node_util_1 = require("node:util");
const constants_1 = require("./constants");
const getMailService = (config) => {
    const transporter = nodemailer_1.default.createTransport(config);
    const send = (mailOptions) => new Promise((rv, rj) => {
        const options = { ...constants_1.generalOptions, ...mailOptions };
        transporter.sendMail(options, (error, info) => {
            error ? rj(error) : rv(info);
        });
    });
    const sendMail = (type, to, origin, token) => {
        const { text, subject } = constants_1.OPTIONS_MAP[type];
        const link = `${origin}/#/account/${type}/${token}`;
        const html = (0, node_util_1.format)(constants_1.template, text, link);
        const options = {
            ...constants_1.generalOptions,
            to,
            subject,
            html,
        };
        return send(options);
    };
    return { sendMail };
};
exports.getMailService = getMailService;
//# sourceMappingURL=mail.js.map