import { IResponse } from './http/types';
import { IRequest } from './types';
import { createUnicCode } from '../utils/crypto';

export const getSessionKey = (req: IRequest, res?: IResponse) => {
  const { cookie } = req.headers;
  let result;
  if (cookie) {
    const regExp = /sessionKey=([^\s]*)\s*;?/;
    [, result] = cookie.match(regExp) || [];
  }
  const sessionKey = result || createUnicCode(15);
  res &&
    !result &&
    res.setHeader('set-cookie', `sessionKey=${sessionKey}; Path=/; httpOnly;`);
  return sessionKey;
};
