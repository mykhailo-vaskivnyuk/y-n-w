import Joi from 'joi';
import { THandler } from '../../../controller/types';
import {
  IMemberConfirmParams,
} from '../../../client/common/server/types/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../../client/common/server/utils';

const refuse: THandler<IMemberConfirmParams, boolean> = async (
  { member: m }, { node_id, member_node_id },
) => {
  const { net_id } = m!.get();
  return domain.utils.exeWithNetLock(net_id, async (t) => {
    await m!.reinit();
    const [member] = await execQuery.member
      .find.inTree([node_id, member_node_id]);
    if (!member) return false; // bad request
    const memberStatus = getMemberStatus(member);
    if (memberStatus !== 'CONNECTED') return false; // bad request

    const { user_id, net_id } = member;
    const event = new domain.event.NetEvent(net_id, 'REFUSE', m!.get());
    const net = new domain.net.NetArrange(t);
    await net.removeConnectedMember(event, user_id!);
    await event.commit(notificationService, t);
    return true;
  });
};
refuse.paramsSchema = MemberConfirmParamsSchema;
refuse.responseSchema = Joi.boolean();
refuse.checkNet = true;

export = refuse;
