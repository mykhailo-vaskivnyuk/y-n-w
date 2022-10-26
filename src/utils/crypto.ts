import { TPromiseExecutor } from '../types';

const crypto = require('node:crypto');

export const createUnicCode = (length: number) => {
  return crypto.randomBytes(length).toString('base64');
};

export const createHash = (password: string) => {
  const executor: TPromiseExecutor<string> = (rv, rj) => {
    const salt = createUnicCode(16);
    crypto.scrypt(password, salt, 64, (err: Error | null, result: Buffer) => {
      err && rj(err);
      const hash = result.toString('base64');
      rv(salt + ':' + hash);
    });
  }
  return new Promise(executor);
};

export const verifyHash = (password: string, hashedPasword: string) => {
  const [salt, hash] = hashedPasword.split(':');
  const executor: TPromiseExecutor<boolean> = (rv, rj) => {
    crypto.scrypt(password, salt, 64, (err: Error | null, result: Buffer) => {
      err && rj(err);
      const hashToVerify = result.toString('base64');
      // console.log(hashToVerify, hash);
      rv(hashToVerify === hash);
    });
  }
  return new Promise(executor);
};
