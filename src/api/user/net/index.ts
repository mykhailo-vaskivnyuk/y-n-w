import {
  INetReadParams, IUserNetDataResponse,
} from '../../../client/common/api/types/types';
import { THandler } from '../../../router/types';
import {
  NetReadParamsSchema, UserNetDataResponseSchema,
} from '../../schema/schema';
import { HandlerError } from '../../../router/errors';
import { findUserNet } from '../../utils/net.utils';

export const getData: THandler<INetReadParams, IUserNetDataResponse> =
  async ({ session }, { net_id }) => {
    const user_id = session.read('user_id')!;
    const net = await findUserNet(user_id, net_id);
    if (!net) throw new HandlerError('NOT_FOUND');
    const [userNetData] = await execQuery.user.net
      .getData([user_id, net_id]);
    return userNetData!;
  };
getData.paramsSchema = NetReadParamsSchema;
getData.responseSchema = UserNetDataResponseSchema;
