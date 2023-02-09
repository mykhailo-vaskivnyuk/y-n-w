import { MEMBER_STATUS_MAP } from '../server/constants';
import { getEnumFromMap } from '../../local/imports';

export enum AppStatus {
  INITING = 'initing',
  INITED = 'inited',
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
}

export const MEMBER_STATUS_ENUM = getEnumFromMap(MEMBER_STATUS_MAP);

export const CONNECTION_ATTEMPT_COUNT = 3;
export const CONNECTION_ATTEMPT_DELAY = 3000;
export const CONNECTION_TIMEOUT = 20000;
