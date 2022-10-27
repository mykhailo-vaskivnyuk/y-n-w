
import { ISessionContent, TModule } from '../types';
import { createService } from '../../services/session/session';

export class SessionError extends Error {
  constructor() {
    super('Session error');
    this.name = this.constructor.name;
  }
}

const createSession = createService<ISessionContent>();

export const setSession: TModule = () => async (context, operation) => {
  const { options } = operation;
  const { sessionKey } = options;
  if (!sessionKey) return [context, operation];
  try {
    const session = await createSession(sessionKey);
    context.session = session;
    return [context, operation];
  } catch (e) {
    logger.error(e);
    throw new SessionError();
  }
}
