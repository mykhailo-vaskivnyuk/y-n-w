import { getEnumFromMap } from "../utils/utils";

export const AppErrorMap = {
  E_START: 'CAN\'T START APP',
  E_SETUP: 'WRONG APP SETUP',
} as const;

export const AppErrorEnum = getEnumFromMap(AppErrorMap);

export type AppErrorCode = keyof typeof AppErrorMap;

export class AppError extends Error {
  public code: AppErrorCode;

  constructor(code: AppErrorCode, message: string = '') {
    super(message || AppErrorMap[code]);
    this.name = this.constructor.name;
    this.code = code;
  }
}
