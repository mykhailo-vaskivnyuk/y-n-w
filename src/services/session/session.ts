import { TValue } from '../../types';
import { ISession } from './types';

export class Session<T extends Record<string, unknown>> implements ISession<T> {
  private session: T | null = null;

  constructor(private id: string) {}

  async write<Q extends TValue<T>>(key: keyof T, value: Q): Promise<Q> {
    if (this.session) {
      this.session[key] = value;
      const strValue = JSON.stringify(this.session);
      await execQuery.session.update([this.id, strValue]);
    } else {
      this.session = { [key]: value } as T;
      const strValue = JSON.stringify(this.session);
      await execQuery.session.create([this.id, strValue]);
    }
    return value;
  }

  read(key: keyof T) {
    if (this.session) return this.session[key];
  }

  async delete(key: keyof T) {
    if (!this.session) return;
    const value = this.session[key];
    if (!value) return;
    const success = delete this.session[key];
    if (!Object.keys(this.session).length) {
      this.session = null;
      await execQuery.session.del([this.id]);
    } else {
      const strValue = JSON.stringify(this.session);
      execQuery.session.update([this.id, strValue]);
    }
    return success ? value : undefined;
  }

  async clear() {
    if (this.session) execQuery.session.del([this.id]);
    this.session = null;
  }

  async init() {
    const result = (await execQuery.session.read([this.id]))[0];
    if (!result) return this;
    this.session = JSON.parse(result.session_value);
    return this;
  }
}

export const createSession = async <T extends Record<string, unknown>>
(sessionId: string): Promise<Session<T>> => {
  return await new Session<T>(sessionId).init();
};
