import { TInputModule } from '../types';
import { USER_STATE_MAP } from '../../client/common/constants';
import { HandlerError } from '../errors';

const loggedInState = USER_STATE_MAP['LOGGEDIN'];

const validateInput: TInputModule = () =>
  async ({ ...operation }, { session }, handler) => {
    const user_state = session.read('user_state') || 'NOT_LOGGEDIN';
    const userState = USER_STATE_MAP[user_state];
    if (userState >= loggedInState) return operation;
    const { allowedForUser } = handler || {};
    if (allowedForUser === 'NOT_LOGGEDIN') return operation;
    if (user_state === 'NOT_LOGGEDIN') throw new HandlerError('UNAUTHORIZED');
    if (allowedForUser === 'NOT_CONFIRMED') return operation;
    throw new HandlerError('NOT_CONFIRMED');
  };

export default validateInput;
