import { getEnumFromMap } from '../utils/utils';

export const RouterErrorMap = {
  E_ROUTES: 'CAN\'T CREATE ROUTES',
  E_NO_ROUTE: 'CAN\'T FIND ROUTE',
  E_HANDLER: 'CAN\'T HANDLE OPERATION',
  E_STREAM: 'CAN\'T READ STREAM',
} as const;

export const RouterErrorEnum = getEnumFromMap(RouterErrorMap);

type RouterErrorCode = keyof typeof RouterErrorMap;

export class RouterError extends Error {
  public code: RouterErrorCode;

  constructor(code: RouterErrorCode, message = '') {
    super(message || RouterErrorMap[code]);
    this.name = this.constructor.name;
    this.code = code;
  }
}
