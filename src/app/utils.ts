import { env } from 'node:process';
import fs from 'node:fs';
import {
  CleanedEnvKeys, ICleanedEnv,
  IConfig, IEnv,
} from '../types/config.types';
import { IGlobalMixins } from './types';

export const setToGlobal = (
  key: keyof IGlobalMixins, obj?: Record<string, any>,
) => {
  Object.freeze(obj);
  Object.assign(global, { [key]: obj });
};

const EnvValuesMap = {
  true: true,
  false: false,
  undefined: false,
  development: true,
};
type EnvValuesKeys = keyof typeof EnvValuesMap;

export const setEnv = (config: IConfig) => {
  const cleanedEnvObj = {
    RUN_ONCE: EnvValuesMap[env.RUN_ONCE as EnvValuesKeys],
    DEV: EnvValuesMap[env.NODE_ENV as EnvValuesKeys]
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
