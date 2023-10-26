import { INetsResponse } from '../../../client/common/server/types/types';
import { THandler } from '../../../controller/types';
import { NetsResponseSchema } from '../../schema/schema';

const get: THandler<never, INetsResponse> = async ({ session }) => {
  const user_id = session.read('user_id');
  const nets = await execQuery.user.nets.get([user_id!]);
  return nets;
};
get.responseSchema = NetsResponseSchema;

export = get;
