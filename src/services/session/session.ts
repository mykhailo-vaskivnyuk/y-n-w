import { IObject } from '../../types';
import { ISession } from './types';

export class Session<T extends IObject = IObject> implements ISession<T> {
  private sessionKey: string;

  private session: T | null = null;

  private finalCallback: () => void;

  constructor(sessionKey: string, finalCallback: () => void) {
    this.sessionKey = sessionKey;
    this.finalCallback = finalCallback;
  }

  async write<K extends keyof T>(key: K, value: T[K]): Promise<T[K]> {
    let isUpdate = true;
    if (!this.session) {
      this.session = {} as T;
      isUpdate = false;
    }

    this.session[key] = value;
    const sessionValue = this.serialize();
    if (isUpdate)
      await execQuery.session.update([this.sessionKey, sessionValue]);
    else await execQuery.session.create([this.sessionKey, sessionValue]);

    return value;
  }

  read<K extends keyof T>(key: K) {
    return this.session?.[key];
  }

  async delete<K extends keyof T>(key: K) {
    if (!this.session) return;
    const value = this.session[key];
    if (!value) return;
    delete this.session[key];
    if (Object.keys(this.session).length) {
      const sessionValue = this.serialize();
      await execQuery.session.update([this.sessionKey, sessionValue]);
    } else await this.clear();
    return value;
  }

  async clear() {
    if (!this.session) return;
    this.session = null;
    await execQuery.session.del([this.sessionKey]);
  }

  async init() {
    const [result] = await execQuery.session.read([this.sessionKey]);
    this.deserialize(result?.session_value);
    return this;
  }

  finalize() {
    this.finalCallback();
  }

  private serialize(): string {
    return JSON.stringify(this.session);
  }

  private deserialize(value: string | undefined) {
    this.session = value ? JSON.parse(value) : null;
  }
}

export const createService = <T extends IObject = IObject>() => {
  const activeSessions = new Map<string, [Promise<Session<T>>, number]>();

  const clearSession = (sessionKey: string) => {
    const [session, count = 0] = activeSessions.get(sessionKey) || [];
    if (!session) return;
    if (count <= 1) activeSessions.delete(sessionKey);
    else activeSessions.set(sessionKey, [session, count - 1]);
  }
  
  const createSession = async (sessionKey: string): Promise<Session<T>> => {
    let [session, count = 0] = activeSessions.get(sessionKey) || [];
    if (!session) session = new Session<T>(sessionKey, () => clearSession(sessionKey)).init();
    activeSessions.set(sessionKey,  [session, ++count]);
    const s = (await activeSessions.get(sessionKey)!)[0]
    return s;
  }

  return createSession;
};
