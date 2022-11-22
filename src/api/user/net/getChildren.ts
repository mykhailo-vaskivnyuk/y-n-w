import { INetSimpleResponse } from '../../../client/common/api/types/net.types';
import { THandler } from '../../../router/types';
import { NetSimpleResponseSchema } from '../../schema/net.schema';

const getChildren: THandler<any, INetSimpleResponse> =
  async ({ session }) => {
    const user_id = session.read('user_id');
    const net_id = session.read('net_id') || null;
    logger.fatal(user_id, net_id);
    return await execQuery.user.net.getChildren([user_id!, net_id]);
  };
getChildren.responseSchema = NetSimpleResponseSchema;

export = getChildren;
