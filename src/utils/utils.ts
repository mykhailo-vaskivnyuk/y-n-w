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

export const excludeNullUndefined = <T>(
  value: T | null | undefined
): value is T => value !== null && value !== undefined;

export const runHeavyOperation = (
  operation: (index: number) => void,
  callsCount: number | (() => number),
  counter = 0,
) => {
  const count = typeof callsCount === 'number' ?
    callsCount : callsCount();
  const sprint = count / 10;
  for (
    let i = 0;
    i < sprint && counter < count;
    counter++, i++
  ) operation(counter);
  if (counter >= count) return;
  setTimeout(runHeavyOperation, 0, operation, count, counter);
};
