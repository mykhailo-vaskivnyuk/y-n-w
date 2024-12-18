import { THttpReqModule } from '../types';
import { getSessionKey } from '../../utils';

export const setSession: THttpReqModule = () =>
  async function setSession(req, res, context) {
    const sessionKey = getSessionKey(req, res);
    const { options } = context;
    options.sessionKey = sessionKey;
    return { ...context, options };
  };
