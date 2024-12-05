/* eslint-disable indent */
import { TInputModule } from '../types';
import {
  loggedInState,
  USER_STATUS_MAP,
} from '../../client/common/server/types/types';
import { HandlerError } from '../errors';

const checkAuthorized: TInputModule =
  () =>
  async ({ ...operation }, { session }, handler) => {
    const user_status = session.read('user_status') || 'NOT_LOGGEDIN';
    const userStatus = USER_STATUS_MAP[user_status];
    if (userStatus >= loggedInState) return operation;
    const { allowedForUser } = handler || {};
    if (allowedForUser === 'NOT_LOGGEDIN') return operation;
    if (user_status === 'NOT_LOGGEDIN') throw new HandlerError('UNAUTHORIZED');
    if (allowedForUser === 'NOT_CONFIRMED') return operation;
    throw new HandlerError('NOT_CONFIRMED');
  };

export default checkAuthorized;
