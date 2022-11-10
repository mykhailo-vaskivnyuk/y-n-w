import { env } from 'node:process';
import fs from 'node:fs';
import {
  CleanedEnvKeys, EnvValuesKeys, EnvValuesMap,
  ICleanedEnv, IConfig, IEnv, IGlobalMixins,
} from './types';

export const setToGlobal = (
  key: keyof IGlobalMixins, obj?: Record<string, any>,
) => {
  Object.freeze(obj);
  Object.assign(global, { [key]: obj });
};

export const setEnv = (config: IConfig) => {
  const cleanedEnvObj = {
    RUN_ONCE: env.RUN_ONCE === 'true',
    DEV: env.NODE_ENV === 'development'
  } as ICleanedEnv;
  if (!cleanedEnvObj.DEV) return cleanedEnvObj;
  const { envPath } = config;
  const envJson = fs.readFileSync(envPath).toString();
  const envObj = JSON.parse(envJson) as IEnv;
  const entries = Object.entries(envObj) as [CleanedEnvKeys, EnvValuesKeys][];
  entries.reduce(
    (cleanedEnvObj, [key, value]) =>
      Object.assign(cleanedEnvObj, { [key]: EnvValuesMap[value] || value }),
    cleanedEnvObj,
  );
  return cleanedEnvObj;
};
