import { THttpReqModule } from '../types';
import { createUnicCode } from '../../../utils/crypto';

export const setSession: THttpReqModule = () =>
  async function setSession(req, res, context) {
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
    const options = { ...context.options, sessionKey };
    return { ...context, options };
  };
