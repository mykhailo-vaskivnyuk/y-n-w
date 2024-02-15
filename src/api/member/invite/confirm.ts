import Joi from 'joi';
import {
  IMemberConfirmParams,
} from '../../../client/common/server/types/types';
import { THandler } from '../../../controller/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../../client/common/server/utils';

const confirm: THandler<IMemberConfirmParams, boolean> = async (
  { member }, { member_node_id }
) => {
  const { net_id, node_id } = member!.get();
  return domain.utils.exeWithNetLock(net_id, async (t) => {
    const [member] = await execQuery
      .member.find.inTree([node_id, member_node_id]);
    if (!member) return false; // bad request
    const memberStatus = getMemberStatus(member);
    if (memberStatus !== 'CONNECTED') return false; // bad request
    await execQuery.member.confirm([member_node_id]);
    await new domain.net.NetArrange().updateCountOfMembers(member_node_id);
    await domain.utils.createTree(t, member);

    const event = new domain.event.NetEvent(net_id, 'CONFIRM', member);
    await event.messages.create();
    await event.commit(notificationService, t);

    return true;
  });
};
confirm.paramsSchema = MemberConfirmParamsSchema;
confirm.responseSchema = Joi.boolean();

export = confirm;
