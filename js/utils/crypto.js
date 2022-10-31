"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyHash = exports.createHash = exports.createUnicCode = void 0;
const crypto = require('node:crypto');
const createUnicCode = (length) => {
    return crypto.randomBytes(length).toString('hex');
};
exports.createUnicCode = createUnicCode;
const createHash = (password) => {
    const executor = (rv, rj) => {
        const salt = (0, exports.createUnicCode)(16);
        crypto.scrypt(password, salt, 64, (err, result) => {
            err && rj(err);
            const hash = result.toString('hex');
            rv(salt + ':' + hash);
        });
    };
    return new Promise(executor);
};
exports.createHash = createHash;
const verifyHash = (password, hashedPasword) => {
    const [salt, hash] = hashedPasword.split(':');
    const executor = (rv, rj) => {
        crypto.scrypt(password, salt, 64, (err, result) => {
            err && rj(err);
            const hashToVerify = result.toString('hex');
            rv(hashToVerify === hash);
        });
    };
    return new Promise(executor);
};
exports.verifyHash = verifyHash;
//# sourceMappingURL=crypto.js.map