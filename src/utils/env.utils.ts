import { env } from 'node:process';
import { ICleanedEnv } from '../types/config.types';

export const EnvValuesMap = {
  true: true,
  false: false,
  undefined: false,
  development: true,
};
export type TEnvValuesKeys = keyof typeof EnvValuesMap;

export const getEnv = () => {
  const DEV = EnvValuesMap[env.NODE_ENV as TEnvValuesKeys];
  const cleanedEnvObj = {
    DEV,
    RUN_ONCE: EnvValuesMap[env.RUN_ONCE as TEnvValuesKeys],
    STATIC_UNAVAILABLE: EnvValuesMap[
      env.STATIC_UNAVAILABLE as TEnvValuesKeys
    ],
    API_UNAVAILABLE: EnvValuesMap[env.API_UNAVAILABLE as TEnvValuesKeys],
    EXIT_ON_ERROR: DEV && EnvValuesMap[env.EXIT_ON_ERROR as TEnvValuesKeys],
  } as ICleanedEnv;
  return cleanedEnvObj;
};
