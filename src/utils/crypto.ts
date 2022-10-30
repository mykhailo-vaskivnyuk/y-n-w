import { TPromiseExecutor } from '../types';

const crypto = require('node:crypto');

export const createUnicCode = (length: number) => {
  return crypto.randomBytes(length).toString('hex');
};

export const createHash = (password: string) => {
  const executor: TPromiseExecutor<string> = (rv, rj) => {
    const salt = createUnicCode(16);
    crypto.scrypt(password, salt, 64, (err: Error | null, result: Buffer) => {
      err && rj(err);
      const hash = result.toString('hex');
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
      const hashToVerify = result.toString('hex');
      rv(hashToVerify === hash);
    });
  }
  return new Promise(executor);
};
