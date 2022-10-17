"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const initMail = (config) => {
    const transporter = nodemailer_1.default.createTransport(config);
    const sendMail = (mailOptions) => new Promise((rv, rj) => transporter.sendMail(mailOptions, (error, info) => {
        error ? rj(error) : rv(info);
    }));
    return sendMail;
};
exports.initMail = initMail;
//# sourceMappingURL=mail.js.map