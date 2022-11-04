export const DatabaseErrorMap = {
  E_DB_CONNECTION: 'Connection to database is not set',
  E_DB_QUERY: 'Database query error',
  E_DB_INIT: 'Initialization error',
} as const;

type DatabaseErrorCode = keyof typeof DatabaseErrorMap;

export class DatabaseError extends Error {
  public code: DatabaseErrorCode;

  constructor(code: DatabaseErrorCode) {
    super(DatabaseErrorMap[code]);
    this.name = this.constructor.name;
    this.code = code;
  }
}
