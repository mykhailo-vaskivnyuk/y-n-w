import Joi from 'joi';
import { INetReadParams } from '../../client/common/server/types/types';
import { THandler } from '../../controller/types';
import { NetReadParamsSchema } from '../schema/schema';
import { removeMemberFromNet } from '../utils/net.utils';
import { NetEvent } from '../../domain/event/event';

const leave: THandler<INetReadParams> = async (
  { userNetData },
) => {
  const { net_id, confirmed } = userNetData!;
  const event_type = confirmed ? 'LEAVE' : 'LEAVE_CONNECTED';
  const event = new NetEvent(net_id, event_type, userNetData);
  await removeMemberFromNet(event);
  return true;
};
leave.paramsSchema = NetReadParamsSchema;
leave.responseSchema = Joi.boolean();
leave.allowedForNetUser = 'INVITING';

export = leave;
