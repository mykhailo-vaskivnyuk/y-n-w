import Joi from 'joi';
import {
  IMemberConfirmParams,
} from '../../../client/common/server/types/types';
import { THandler } from '../../../controller/types';
import { NetEvent } from '../../../domain/event/event';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../../client/common/server/utils';

const confirm: THandler<IMemberConfirmParams, boolean> = async (
  { member: m }, { node_id, member_node_id },
) => {
  const { net_id } = m!.get();
  let event!: NetEvent;
  const result = await domain.utils.exeWithNetLock(net_id, async (t) => {
    await m!.reinit();
    const [member] = await execQuery
      .member.find.inTree([node_id, member_node_id]);
    if (!member) return false; // bad request
    const memberStatus = getMemberStatus(member);
    if (memberStatus !== 'CONNECTED') return false; // bad request
    await t.execQuery.member.confirm([member_node_id]);
    const net = new domain.net.NetArrange(t);
    await net.updateCountOfMembers(member_node_id);
    await domain.net.createTree(t, member);

    event = new domain.event.NetEvent(net_id, 'CONFIRM', member);
    await event.messages.create(t);
    await event.commit(notificationService, t);

    return true;
  });
  event.send();
  return result;
};
confirm.paramsSchema = MemberConfirmParamsSchema;
confirm.responseSchema = Joi.boolean();
confirm.checkNet = true;

export = confirm;
