export enum AppStatus {
  INITING = 'initing',
  INITED = 'inited',
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
}

export const USER_STATUS_MAP = {
  'NOT_LOGGEDIN': 0,
  'NOT_CONFIRMED': 1,
  'LOGGEDIN': 2,
  'INVITING': 3,
  'INSIDE_NET': 4,
  'DEV': Infinity,
};
export type UserStatusKeys = keyof typeof USER_STATUS_MAP;
export type PartialUserStatusKeys = keyof Pick<typeof USER_STATUS_MAP,
  | 'NOT_LOGGEDIN'
  | 'NOT_CONFIRMED'>
export const loggedInState = USER_STATUS_MAP.LOGGEDIN;
export const CONECTION_ATTEMPT_COUNT = 3;
export const CONNECTION_ATTEMPT_DELAY = 3000;
export const CONNECTION_TIMEOUT = 20000;
