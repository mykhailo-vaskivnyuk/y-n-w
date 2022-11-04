"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPTIONS_MAP = exports.generalOptions = exports.template = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
exports.template = node_fs_1.default.readFileSync('src/services/mail/template.html').toString();
exports.generalOptions = { from: 'm.vaskivnyuk@gmail.com', sender: 'You & World' };
exports.OPTIONS_MAP = {
    confirm: {
        text: 'Якщо ви реєструвалсь на сайті You &amp; World - підтвердіть свій email. Для цього клікніть на лінк нижче.',
        subject: 'Confirm email on You & World',
    },
    restore: {
        text: 'Якщо ви хочете увійти на сайт You &amp; World - клікніть на лінк нижче.',
        subject: 'Login into You & World',
    }
};
//# sourceMappingURL=constants.js.map