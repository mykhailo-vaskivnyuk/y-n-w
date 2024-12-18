import { IObject } from '../../types/types';
import { ISession } from './types';

export class Session<T extends IObject = IObject> implements ISession<T> {
  private session: Partial<T> | null = null;
  private persisted = false;

  constructor(
    private sessionKey: string,
    private finalCallback: (sessionKey: string) => void,
  ) {}

  async init() {
    const [persisted] = await execQuery.session.read([this.sessionKey]);
    this.persisted = Boolean(persisted);
    this.deserialize(persisted?.session_value);
    return this;
  }

  read<K extends keyof T>(key: K) {
    return this.session?.[key];
  }

  write<K extends keyof T>(key: K, value: T[K]): T[K] {
    !this.session && (this.session = {});
    return (this.session[key] = value);
  }

  delete<K extends keyof T>(key: K) {
    if (!this.session) return;
    const value = this.session[key];
    delete this.session[key];
    const length = Object.keys(this.session).length;
    if (!length) this.clear();
    return value;
  }

  clear() {
    this.session = null;
  }

  async finalize() {
    await this.finalCallback(this.sessionKey);
  }

  private serialize(): string {
    return JSON.stringify(this.session);
  }

  private deserialize(value: string | undefined) {
    this.session = JSON.parse(value || 'null');
  }

  async persist() {
    if (!this.session && this.persisted) {
      await execQuery.session.remove([this.sessionKey]);
      return;
    }
    if (!this.session) return;
    const sessionValue = this.serialize();
    const userId = this.session.user_id as number;
    if (this.persisted)
      await execQuery.session.update([this.sessionKey, sessionValue]);
    else
      await execQuery.session.create([userId, this.sessionKey, sessionValue]);
  }
}

export const getService = <T extends IObject = IObject>() => {
  const activeSessions = new Map<string, [Promise<Session<T>>, number]>();

  const clearSession = async (sessionKey: string) => {
    const [sessionPromise, count = 0] = activeSessions.get(sessionKey) || [];
    if (!sessionPromise) return;
    if (count > 1) activeSessions.set(sessionKey, [sessionPromise, count - 1]);
    else {
      activeSessions.delete(sessionKey);
      await sessionPromise.then((session) => session.persist());
    }
  };

  const createSession = async (sessionKey: string): Promise<Session<T>> => {
    let [session, count = 0] = activeSessions.get(sessionKey) || [];
    if (!session) session = new Session<T>(sessionKey, clearSession).init();
    activeSessions.set(sessionKey, [session, ++count]);
    return session;
  };

  return { createSession };
};
