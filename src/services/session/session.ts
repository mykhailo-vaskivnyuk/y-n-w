import { IObject } from '../../types';
import { ISession } from './types';

export class Session<T extends IObject> implements ISession<T> {
  private session: T | null = null;

  constructor(private sessionKey: string) {}

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
    if (this.session) return this.session[key];
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
    const result = await execQuery.session.read([this.sessionKey]);
    if (!result?.[0]) return this;
    const { session_value } = result[0];
    this.deserialize(session_value);
    return this;
  }

  private serialize(): string {
    return JSON.stringify(this.session);
  }

  private deserialize(value: string) {
    this.session = JSON.parse(value);
  }
}

export const createSession = async <T extends IObject>
(sessionKey: string): Promise<Session<T>> => {
  return await new Session<T>(sessionKey).init();
};
