import Joi from 'joi';
import { THandler } from '../../../router/types';
import {
  IMemberConfirmParams,
} from '../../../client/common/server/types/types';
import { NetEvent } from '../../../services/event/event';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../../client/common/server/utils';
import { Net } from '../../../services/net/net';

const refuse: THandler<IMemberConfirmParams, boolean> = async (
  { userNetData }, { node_id, member_node_id }
) => {
  const [member] = await execQuery.member
    .find.inTree([node_id, member_node_id]);
  if (!member) return false; // bad request

  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'CONNECTED') return false; // bad request

  const { user_id, net_id } = member;
  const event = new NetEvent(net_id, 'REFUSE', userNetData);
  await new Net().removeConnectedMember(event, user_id!);
  await event.commit(notificationService);
  return true;
};
refuse.paramsSchema = MemberConfirmParamsSchema;
refuse.responseSchema = Joi.boolean();

export = refuse;
