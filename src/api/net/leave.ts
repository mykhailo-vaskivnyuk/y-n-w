import Joi from 'joi';
import { INetReadParams } from '../../client/common/server/types/types';
import { THandler } from '../../controller/types';
import { NetReadParamsSchema } from '../schema/schema';

const leave: THandler<INetReadParams> = async (
  { member },
) => {
  const m = member!.get();
  const { net_id, confirmed } = m;
  const event_type = confirmed ? 'LEAVE' : 'LEAVE_CONNECTED';
  const event = new domain.event.NetEvent(net_id, event_type, m);
  await domain.net.removeMemberFromNet(event);
  return true;
};
leave.paramsSchema = NetReadParamsSchema;
leave.responseSchema = Joi.boolean();
leave.allowedForNetUser = 'INVITING';

export = leave;
