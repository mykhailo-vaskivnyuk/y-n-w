import { env } from 'node:process';
import fs from 'node:fs';
import { CleanedEnvKeys, ICleanedEnv } from '../types/config.types';

export const getEnv = () => {
  const DEV = env.NODE_ENV === 'development';
  let envLocal;
  try {
    const data = fs.readFileSync('.env.json');
    envLocal = JSON.parse(data.toString());
  } catch {
    envLocal = {};
  }

  Object.assign(env, envLocal);
  const {
    TRANSPORT = 'ws',
    HOST = 'localhost',
    PORT = 8000,
    DATABASE_URL = '',
    RUN_ONCE = false,
    STATIC_UNAVAILABLE = false,
    API_UNAVAILABLE = false,
    EXIT_ON_ERROR = false,
    MAIL_CONFIRM_OFF = false,
    TG_BOT_TOKEN = '',
  } = env as Record<CleanedEnvKeys, any>;

  const cleanedEnvObj: ICleanedEnv = {
    DEV,
    TRANSPORT,
    HOST,
    PORT: +PORT,
    DATABASE_URL,
    RUN_ONCE,
    STATIC_UNAVAILABLE,
    API_UNAVAILABLE,
    EXIT_ON_ERROR,
    MAIL_CONFIRM_OFF,
    TG_BOT_TOKEN,
  };

  return cleanedEnvObj;
};
