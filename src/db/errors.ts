export const DatabaseErrorMap = {
  DB_CONNECTION_ERROR: 'Connection to database is not set',
  DB_QUERY_ERROR: 'Database query error',
  DB_INIT_ERROR: 'Initialization error',
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
