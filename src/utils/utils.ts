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

export const isNumberNotNull = (
  value: number | null,
): value is number => value !== null;

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
    i < sprint && counter < callsCount;
    counter++, i++
  ) operation(counter);
  if (counter >= callsCount) return;
  setTimeout(runHeavyOperation, 0, operation, count, counter);
};
