export enum AppStatus {
  INITING = 'initing',
  INITED = 'inited',
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
}

export const CONECTION_ATTEMPT_COUNT = 3;
export const CONNECTION_ATTEMPT_DELAY = 3000;
export const CONNECTION_TIMEOUT = 20000;
