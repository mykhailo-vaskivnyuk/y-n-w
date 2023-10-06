import Joi from 'joi';
import { INetReadParams } from '../../client/common/server/types/types';
import { THandler } from '../../router/types';
import { NetReadParamsSchema } from '../schema/schema';
import { removeMember } from '../utils/utils';

const leave: THandler<INetReadParams> = async (
  { session, userNetData },
) => {
  const event = 'LEAVE';
  const user_id = session.read('user_id')!;
  const { net_id } = userNetData!;
  await removeMember(event, user_id, net_id);
  return true;
};
leave.paramsSchema = NetReadParamsSchema;
leave.responseSchema = Joi.boolean();
leave.allowedForNetUser = 'INVITING';

export = leave;
