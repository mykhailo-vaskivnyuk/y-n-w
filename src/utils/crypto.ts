import crypto from 'node:crypto';
import { URLSearchParams } from 'node:url';
import { TPromiseExecutor } from '../../src/client/common/types';

export const createUnicCode = (length: number): string => {
  const byteLenth = Math.ceil(length / 2);
  const codeBuffer = crypto.randomBytes(byteLenth);
  const codeHexString = codeBuffer.toString('hex');
  return codeHexString;
};

export const createHash = (password: string) => {
  const executor: TPromiseExecutor<string> = (rv, rj) => {
    const salt = createUnicCode(16);
    crypto.scrypt(password, salt, 64, (err: Error | null, result: Buffer) => {
      err && rj(err);
      const hash = result.toString('hex');
      rv(salt + ':' + hash);
    });
  };
  return new Promise(executor);
};

export const verifyHash = (password: string, hashedPasword: string) => {
  const [salt, hash] = hashedPasword.split(':');
  const executor: TPromiseExecutor<boolean> = (rv, rj) => {
    crypto.scrypt(password, salt!, 64, (err: Error | null, result: Buffer) => {
      err && rj(err);
      const hashToVerify = result.toString('hex');
      rv(hashToVerify === hash);
    });
  };
  return new Promise(executor);
};

export const verifyTgData = (initData: string): WebAppUser | null => {
  if (!env.TG_BOT_TOKEN) return null;

  const initDataMap = new URLSearchParams(initData);
  const initDataObj: any = {};
  initDataMap.forEach((value, key) => (initDataObj[key] = value));

  const { hash, ...restData } = initDataObj;
  const checkString = Object.entries(restData)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([key, val]) => `${key}=${val}`)
    .join('\n');

  const { createHmac } = crypto;
  const algorithm = 'sha256';
  const key1 = 'WebAppData';
  const key2 = createHmac(algorithm, key1).update(env.TG_BOT_TOKEN).digest();
  const result = createHmac(algorithm, key2).update(checkString).digest('hex');

  if (result !== hash) return null;

  const userInitDataJson = initDataObj.user;
  const user = JSON.parse(userInitDataJson);
  user.id = user.id.toString();
  return user as WebAppUser;
};
