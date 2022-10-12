import { TValue } from '../../types';

export interface ISession<T extends Record<string, unknown>> {
  write<Q extends TValue<T>>(key: keyof T, value: Q): Promise<Q>;
  read(key: keyof T): TValue<T> | undefined;
  delete(key: keyof T): Promise<TValue<T> | undefined>;
  clear(): Promise<void>;
  init(): Promise<this>;
}
