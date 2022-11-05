import { IObject } from '../../types/types';

export interface ISession<T extends IObject = IObject> {
  write<K extends keyof T>(key: K, value: T[K]): T[K];
  read<K extends keyof T>(key: K): T[K] | undefined;
  delete<K extends keyof T>(key: K): T[K] | undefined;
  clear(): void;
  init(): Promise<this>;
  finalize(): Promise<void>;
  persist(): Promise<void>;
}
