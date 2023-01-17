import { TInputModule } from '../types';
import { findUserNet } from '../../api/utils/net.utils';
import { HandlerError } from '../errors';

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
    if (handler.allowedForNetUser === 'INVITING')
      throw new HandlerError('FORBIDDEN');
    context.userNet = userNet;
    context.userNetStatus = userNetStatus;
    return operation;
  };

export default setUserNet;
