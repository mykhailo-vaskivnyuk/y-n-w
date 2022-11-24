import { INetsResponse } from '../../../client/common/api/types/net.types';
import { THandler } from '../../../router/types';
import { NetsResponseSchema } from '../../schema/net.schema';

const get: THandler<never, INetsResponse> = async ({ session }) => {
  const user_id = session.read('user_id');
  return await execQuery.user.nets.get([user_id!]);
};
get.responseSchema = NetsResponseSchema;

export = get;
