import { THttpModule } from '../types';
import { createUnicCode } from '../../../utils/crypto';

export const setSession: THttpModule = () =>
  async function setSession(req, res, options) {
    const { cookie } = req.headers;
    let result;
    if (cookie) {
      const regExp = /sessionKey=([^\s]*)\s*;?/;
      [, result] = cookie.match(regExp) || [];
    }
    const sessionKey = result || createUnicCode(15);
    res.setHeader(
      'set-cookie', `sessionKey=${sessionKey}; Path=/; httpOnly`
    );
    return { ...options, sessionKey };
  };
