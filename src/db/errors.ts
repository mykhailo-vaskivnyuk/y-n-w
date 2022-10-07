import { encode } from "node:punycode";
import { TextEncoder } from "node:util";
import { getEnumFromMap } from "../utils/utils";
import encoding from 'iconv-lite';

export const DatabaseErrorMap = {
  E_DB_CONNECTION: 'Connection to database is not set',
  E_DB_QUERY: 'Database query error',
} as const;

export const DatabaseErrorEnum = getEnumFromMap(DatabaseErrorMap);

export type DatabaseErrorCode = keyof typeof DatabaseErrorMap;

export class DatabaseError extends Error {
  public code: DatabaseErrorCode;

  constructor(code: DatabaseErrorCode, message: string = '') {
    super(message || DatabaseErrorMap[code]);
    this.name = this.constructor.name;
    this.code = code;
  }
}
