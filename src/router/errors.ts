import { getEnumFromMap } from "../utils/utils";

export const RouterErrorMap = {
  E_ROUTES: 'CAN\'T CREATE ROUTES',
  E_NOT_FOUND: 'CAN\'T FIND ROUTE',
  E_HANDLER: 'CAN\'T HANDLE OPERATION',
} as const;

export const RouterErrorEnum = getEnumFromMap(RouterErrorMap);

export type RouterErrorCode = keyof typeof RouterErrorMap;

export class RouterError extends Error {
  public code: RouterErrorCode;

  constructor(code: RouterErrorCode, message: string = '') {
    super(message || RouterErrorMap[code]);
    this.name = this.constructor.name;
    this.code = code;
  }
}
