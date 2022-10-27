import { IObject } from '../../types';

export interface ISession<T extends IObject = IObject> {
  write<K extends keyof T>(key: K, value: T[K]): Promise<T[K]>;
  read<K extends keyof T>(key: K): T[K] | undefined;
  delete<K extends keyof T>(key: K): Promise<T[K] | undefined>;
  clear(): Promise<void>;
  init(): Promise<this>;
  finalize: () => void;
}
