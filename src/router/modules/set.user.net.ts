import { TInputModule } from '../types';
import { USER_STATUS_MAP } from '../../client/common/server/types/types';
import { HandlerError } from '../errors';
import { findUserNet } from '../../api/utils/net.utils';

const setUserNet: TInputModule = () =>
  async ({ ...operation }, context, handler) => {
    const { node_id } = operation.data.params;
    if (!node_id) return operation;
    const { session } = context;
    const user_id = session.read('user_id');
    if (!user_id) return operation;
    const user_status = session.read('user_status');
    if (user_status !== 'LOGGEDIN') return operation;
    const [userNet, userNetStatus] = await findUserNet(user_id, node_id);
    if (!userNet) throw new HandlerError('NOT_FOUND');
    const allowedForNetUser = handler.allowedForNetUser || 'INSIDE_NET';
    if (USER_STATUS_MAP[userNetStatus] < USER_STATUS_MAP[allowedForNetUser])
      throw new HandlerError('FORBIDDEN');
    context.userNetData = userNet;
    context.userNetStatus = userNetStatus;
    return operation;
  };

export default setUserNet;
