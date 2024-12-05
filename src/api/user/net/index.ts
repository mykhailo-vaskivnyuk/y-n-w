import {
  INetEnterParams,
  IUserNetDataResponse,
} from '../../../client/common/server/types/types';
import { THandler } from '../../../controller/types';
import { HandlerError } from '../../../controller/errors';
import {
  NetEnterParamsSchema,
  UserNetDataResponseSchema,
} from '../../schema/schema';

export const getData: THandler<INetEnterParams, IUserNetDataResponse> = async (
  { session },
  { net_id },
) => {
  const user_id = session.read('user_id')!;
  const [userNetData] = await execQuery.user.netData.get([user_id, net_id]);
  if (!userNetData) throw new HandlerError('NOT_FOUND');
  return userNetData!;
};
getData.paramsSchema = NetEnterParamsSchema;
getData.responseSchema = UserNetDataResponseSchema;
