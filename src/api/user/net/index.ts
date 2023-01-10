import {
  INetReadParams, IUserNetDataResponse,
} from '../../../client/common/api/types/types';
import { THandler } from '../../../router/types';
import {
  NetReadParamsSchema, UserNetDataResponseSchema,
} from '../../schema/schema';

export const getData: THandler<INetReadParams, IUserNetDataResponse> =
  async ({ session, userNet }) => {
    const user_id = session.read('user_id')!;
    const { net_node_id } = userNet!;
    const [userNetData] = await execQuery.user.net
      .getData([user_id, net_node_id]);
    return userNetData!;
  };
getData.paramsSchema = NetReadParamsSchema;
getData.responseSchema = UserNetDataResponseSchema;
