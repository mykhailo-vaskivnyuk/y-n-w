import { IAppThis } from './types';
import { DatabaseError } from '../db/errors';
import {
  ControllerError,
  ControllerErrorCode,
  TControllerErrorDetails,
} from '../controller/errors';
import { ServerError } from '../server/errors';

export const AppErrorMap = {
  CONTROLLER_ERROR: 'CONTROLLER ERROR',
  INIT_ERROR: 'API IS NOT INITIALIZED OR SET UNAVAILABLE',
} as const;
type AppErrorCode = keyof typeof AppErrorMap;

export class AppError extends Error {
  public code: AppErrorCode;

  constructor(code: AppErrorCode, message = '') {
    super(message || AppErrorMap[code]);
    this.name = this.constructor.name;
    this.code = code;
  }
}

export const KNOWN_ERRORS_MAP = [
  DatabaseError.name,
  ControllerError.name,
  ServerError.name,
  AppError.name,
];

export const setUncaughtErrorHandlers = (parent: IAppThis) => {
  const { env } = parent.config;
  const uncaughtErrorHandler = (e: any) => {
    if (!KNOWN_ERRORS_MAP.includes(e.name))
      parent.logger ? logger.fatal(e) : console.error(e);
    if (!env.EXIT_ON_ERROR) return;
    parent.shutdown();
  };
  process.on('unhandledRejection', uncaughtErrorHandler);
  process.on('uncaughtException', uncaughtErrorHandler);
};

export const handleAppInitError = async (e: any, parent: IAppThis) => {
  const { env } = parent.config;
  if (!parent.logger) return await parent.shutdown("CAN'T START APP");
  if (!KNOWN_ERRORS_MAP.includes(e.name)) logger.error(e);
  if (e.name === AppError.name) logger.error(e);
  env.RUN_ONCE && process.exit();
  env.API_UNAVAILABLE = true;
  try {
    parent.logger.fatal("CAN'T START API SERVICE");
    if (!parent.server) throw e;
    await parent.server.start();
    logger.info('SERVER IS RUNNING');
  } catch (e: any) {
    if (!KNOWN_ERRORS_MAP.includes(e.name)) logger.error(e);
    if (e.name === AppError.name) logger.error(e);
    await parent.shutdown("CAN'T START APP");
  }
};

const OPERATION_ERRORS_MAP: Partial<
  Record<ControllerErrorCode, (details: TControllerErrorDetails) => never>
> = {
  CANT_FIND_ENDPOINT: (details: TControllerErrorDetails) => {
    throw new ServerError('NOT_FOUND', details);
  },
  MODULE_ERROR: (details: TControllerErrorDetails) => {
    throw new ServerError('BED_REQUEST', details);
  },
  REDIRECT: (details: TControllerErrorDetails) => {
    throw new ServerError('REDIRECT', details);
  },
  UNAUTHORIZED: (details: TControllerErrorDetails) => {
    throw new ServerError('UNAUTHORIZED', details);
  },
  NOT_CONFIRMED: (details: TControllerErrorDetails) => {
    throw new ServerError('FORBIDDEN', details);
  },
  FORBIDDEN: (details: TControllerErrorDetails) => {
    throw new ServerError('FORBIDDEN', details);
  },
};

export const handleOperationError = (e: any): never => {
  if (e.name === ControllerError.name) {
    const { code, details } = e;
    OPERATION_ERRORS_MAP[code as ControllerErrorCode]?.(details);
  } else {
    logger.error(e);
  }
  throw new AppError('CONTROLLER_ERROR');
};
