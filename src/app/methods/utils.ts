import { IGlobalMixins } from '../types';

export const setToGlobal = (
  key: keyof IGlobalMixins,
  obj?: Record<string, any>,
) => {
  Object.freeze(obj);
  Object.assign(globalThis, { [key]: obj });
};
