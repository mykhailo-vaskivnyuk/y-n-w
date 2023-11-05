import { TInputModule } from '../types';
import { USER_STATUS_MAP } from '../../client/common/server/types/types';
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

    const member = new domain.member.Member();
    await member.init(user_id, node_id);
    const status = member.getStatus();
    const allowedForNetUser = handler.allowedForNetUser || 'INSIDE_NET';
    if (USER_STATUS_MAP[status] < USER_STATUS_MAP[allowedForNetUser])
      throw new HandlerError('FORBIDDEN');
    context.member = member;
    return operation;
  };

export default setUserNet;
