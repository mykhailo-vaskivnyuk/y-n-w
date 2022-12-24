import { env } from 'node:process';
import { CleanedEnvKeys, ICleanedEnv } from '../types/config.types';

export const getEnv = () => {
  const DEV = env.NODE_ENV === 'development';
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
  };

  return cleanedEnvObj;
};
