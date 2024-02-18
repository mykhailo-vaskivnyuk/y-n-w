import Joi from 'joi';
import { THandler } from '../../../controller/types';
import {
  IMemberConfirmParams,
} from '../../../client/common/server/types/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../../client/common/server/utils';

export const set: THandler<IMemberConfirmParams, boolean> = async (
  { member: m }, { node_id, member_node_id },
) => {
  const { net_id } = m!.get();
  return domain.utils.exeWithNetLock(net_id, async (t) => {
    await m!.reinit();
    const { parent_node_id } = m!.get();
    let [member] = await execQuery
      .member.find.inTree([node_id, member_node_id]);
    const parentNodeId = member ? node_id : parent_node_id;
    if (!member) {
      if (!parent_node_id) return false; // bad request
      [member] = await execQuery
        .member.find.inCircle([parent_node_id, member_node_id]);
      if (!member) return false; // bad request
    }
    const memberStatus = getMemberStatus(member);
    if (memberStatus !== 'ACTIVE') return false; // bad request
    const event = new domain.event.NetEvent(net_id, 'DISLIKE', m!.get());
    const net = await new domain.net.NetArrange(t);
    const params = [parentNodeId!, node_id, member_node_id] as const;
    await t.execQuery.member.data.setDislike([...params]);
    await net.arrangeNodes(event, [parentNodeId]);
    await event.commit(notificationService, t);
    return true;
  });
};
set.paramsSchema = MemberConfirmParamsSchema;
set.responseSchema = Joi.boolean();
set.checkNet = true;

export const unSet: THandler<IMemberConfirmParams, boolean> = async (
  { member: m }, { node_id, member_node_id }
) => {
  const { parent_node_id } = m!.get();
  let parentNodeId: number | null = node_id;
  let [member] = await execQuery.member
    .find.inTree([parentNodeId, member_node_id]);
  if (!member) {
    parentNodeId = parent_node_id;
    if (!parentNodeId) return false; // bad request
    [member] = await execQuery.member
      .find.inCircle([parentNodeId, member_node_id]);
    if (!member) return false; // bad request
  }
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'ACTIVE') return false; // bad request
  await execQuery.member.data
    .unsetDislike([node_id, member_node_id]);
  return true;
};
unSet.paramsSchema = MemberConfirmParamsSchema;
unSet.responseSchema = Joi.boolean();
unSet.checkNet = true;
