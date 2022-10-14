
import { ISessionContent, TModule } from '../types';
import { createSession } from '../../services/session/session';

export class SessionError extends Error {
  constructor() {
    super('Session error');
    this.name = this.constructor.name;
  }
}

export const setSession: TModule = () => async (context, data) => {
  const { params } = data;
  const { sessionKey } = params;
  if (!sessionKey) return [context, data];
  try {
    const session = await createSession<ISessionContent>(sessionKey);
    context.session = session;
    return [context, data];
  } catch (e) {
    logger.error(e);
    throw new SessionError();
  }
}
