import Joi from 'joi';
import { INetReadParams } from '../../client/common/server/types/types';
import { THandler } from '../../router/types';
import { NetReadParamsSchema } from '../schema/schema';
import { removeMember } from '../utils/net.utils';
import { NetEvent } from '../../services/event/event';

const leave: THandler<INetReadParams> = async (
  { session, userNetData },
) => {
  const { net_id, confirmed } = userNetData!;
  const event_type = confirmed ? 'LEAVE' : 'LEAVE_CONNECTED';
  const event = new NetEvent(net_id, event_type, userNetData);
  const user_id = session.read('user_id')!;
  await removeMember(event, user_id);
  return true;
};
leave.paramsSchema = NetReadParamsSchema;
leave.responseSchema = Joi.boolean();
leave.allowedForNetUser = 'INVITING';

export = leave;
