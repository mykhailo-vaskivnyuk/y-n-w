/* eslint-disable indent */
import { ISessionContent, TInputModule } from '../types';
import { getService } from '../../services/session/session';

export class SessionError extends Error {
  constructor() {
    super('Session error');
    this.name = this.constructor.name;
  }
}

const { createSession } = getService<ISessionContent>();

const setSession: TInputModule =
  () =>
  async ({ ...operation }, context) => {
    const { options } = operation;
    const { sessionKey } = options;
    if (!sessionKey) throw new SessionError();
    try {
      const session = await createSession(sessionKey);
      context.session = session;
      return operation;
    } catch (e: any) {
      logger.error(e);
      throw new SessionError();
    }
  };

export default setSession;
