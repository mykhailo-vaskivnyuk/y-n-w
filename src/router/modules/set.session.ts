
import { ISessionContent, TModule } from '../types';
import { createSession } from '../../services/session/session';

export class SessionError extends Error {
  constructor() {
    super('Session error');
    this.name = this.constructor.name;
  }
}

export const setSession: TModule = () => async (context, operation) => {
  const { options } = operation;
  const { sessionKey } = options;
  if (!sessionKey) return [context, operation];
  try {
    const session = await createSession<ISessionContent>(sessionKey);
    await session.init();
    context.session = session;
    return [context, operation];
  } catch (e) {
    logger.error(e);
    throw new SessionError();
  }
}
