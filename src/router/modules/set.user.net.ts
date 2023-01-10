import { TInputModule } from '../types';
import { findUserNet } from '../../api/utils/net.utils';

const setUserNet: TInputModule = () =>
  async ({ ...operation }, context) => {
    const { node_id } = operation.data;
    if (!node_id) return operation;
    const { session } = context;
    const user_id = session.read('user_id');
    if (!user_id) return operation;
    const user_status = session.read('user_status');
    if (user_status !== 'LOGGEDIN') return operation;
    const [userNet, userNetStatus] = await findUserNet(user_id, node_id);
    context.userNet = userNet;
    context.userNetStatus = userNetStatus;
    return operation;
  };

export default setUserNet;
