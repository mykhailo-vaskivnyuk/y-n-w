import {
  INetEnterParams, IUserNetDataResponse,
} from '../../../client/common/api/types/types';
import { THandler } from '../../../router/types';
import { HandlerError } from '../../../router/errors';
import {
  NetEnterParamsSchema, UserNetDataResponseSchema,
} from '../../schema/schema';

export const getData: THandler<INetEnterParams, IUserNetDataResponse> =
  async ({ session }, { net_node_id }) => {
    const user_id = session.read('user_id')!;
    const [userNetData] = await execQuery.user.net
      .getData([user_id, net_node_id]);
    if (!userNetData) throw new HandlerError('NOT_FOUND');
    return userNetData!;
  };
getData.paramsSchema = NetEnterParamsSchema;
getData.responseSchema = UserNetDataResponseSchema;
