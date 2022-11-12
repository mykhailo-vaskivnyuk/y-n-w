import { resolve } from 'path';

export const getEnumFromMap =
  <
    T extends Record<string | number, unknown>,
    Q extends Record<keyof T, keyof T>
  >(map: T): Q =>
    Object
      .keys(map)
      .reduce((obj, key) => {
        const value = Number.isNaN(+key) ? key : +key;
        Object.assign(obj, { [key]: value });
        return obj;
      }, {} as Q);

export const createPathResolve = (basePath: string) =>
  (path: string) => resolve(basePath, path);
