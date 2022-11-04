
import { ISessionContent, TModule } from '../types';
import { getService } from '../../services/session/session';

export class SessionError extends Error {
  constructor() {
    super('Session error');
    this.name = this.constructor.name;
  }
}

const { createSession } = getService<ISessionContent>();

const setSession: TModule = () => async (operation, context) => {
  const { options } = operation;
  const { sessionKey } = options;
  if (!sessionKey) return [operation, context];
  try {
    const session = await createSession(sessionKey);
    context.session = session;
    return [operation, context];
  } catch (e: any) {
    logger.error(e, e.message);
    throw new SessionError();
  }
};

export default setSession;
