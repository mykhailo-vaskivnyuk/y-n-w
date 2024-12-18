/* eslint-disable indent */
import { resolve } from 'node:path';
import { setTimeout } from 'node:timers/promises';
/**
 * {              |  {
 *  KEY1: value1, |    KEY1: KEY1,
 *  KEY2: value2, |    KEY2: KEY2,
 * }              |  }
 */
export const getEnumFromMap = <
  T extends Record<string | number, unknown>,
  Q extends Record<keyof T, keyof T>,
>(
  map: T,
): Q =>
  Object.keys(map).reduce((obj, key) => {
    const value = Number.isNaN(+key) ? key : +key;
    Object.assign(obj, { [key]: value });
    return obj;
  }, {} as Q);

/**
 * {              |  {
 *  VALUE1: KEY1, |    KEY1: VALUE1,
 *  VALUE2: KEY2, |    KEY2: VALUE2,
 * }              |  }
 */
export const createEnumFromMap = <
  T extends Record<string | number, string | number>,
  Q extends Record<T[keyof T], keyof T>,
>(
  map: T,
): Q =>
  Object.keys(map).reduce((obj, key) => {
    const value = Number.isNaN(+key) ? key : +key;
    Object.assign(obj, { [map[key] as string]: value });
    return obj;
  }, {} as Q);

/**
 * [      |  {
 *  KEY1, |    KEY1: KEY1,
 *  KEY2, |    KEY2: KEY2,
 * ]      |  }
 */
export const createEnumFromArray = <
  T extends readonly (string | number)[],
  Q extends Record<T[number], T[number]>,
>(
  array: T,
): Q =>
  array.reduce((obj, key) => {
    const value = Number.isNaN(+key) ? key : +key;
    Object.assign(obj, { [key]: value });
    return obj;
  }, {} as Q);

export const createPathResolve = (basePath: string) => (path: string) =>
  resolve(basePath, path);

export const excludeNullUndefined = <T>(
  value: T | null | undefined,
): value is T => value !== null && value !== undefined;

/**
 * '/path1/path2/path3/' => ['path1', 'path2', 'path3']
 */
export const pathToArray = (pathname: string) =>
  pathname.split('/').filter(Boolean);

export const runHeavyOperation = (
  operation: (index: number) => void,
  callsCount: number | (() => number),
  counter = 0,
) => {
  const count = typeof callsCount === 'number' ? callsCount : callsCount();
  const sprint = count / 10;
  for (let i = 0; i < sprint && counter < count; counter++, i++)
    operation(counter);
  if (counter >= count) return;
  setTimeout(0).then(() => runHeavyOperation(operation, count, counter));
};

export const delay = (time: number) => setTimeout(time);
