export enum AppState {
  INITING = 'initing',
  INITED = 'inited',
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
}

export const USER_STATE_MAP = {
  'NOT_LOGGEDIN': 0,
  'NOT_CONFIRMED': 1,
  'LOGGEDIN': 2,
  'INSIDE_NET': 3,
  'DEV': Infinity,
};
export type UserStateKeys = keyof typeof USER_STATE_MAP;
export type PartialUserStateKeys = keyof Pick<
  typeof USER_STATE_MAP, 'NOT_LOGGEDIN' | 'NOT_CONFIRMED'
>
export const loggedInState = USER_STATE_MAP.LOGGEDIN;
export const CONECTION_ATTEMPT_COUNT = 3;
export const CONNECTION_DELAY = 3000;
