import Joi from 'joi';
import { THandler } from '../../../controller/types';
import {
  IMemberConfirmParams,
} from '../../../client/common/server/types/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../../client/common/server/utils';

const { exeWithNetLock } = domain.utils;

export const set: THandler<IMemberConfirmParams, boolean> = async (
  { member: actionMember }, { node_id, member_node_id }
) => {
  const m = actionMember!.get();
  const { net_id, parent_node_id } = m;
  return exeWithNetLock(net_id, async (t) => {
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
    await execQuery.member.data
      .setDislike([parentNodeId!, node_id, member_node_id]);
    const event = new domain.event.NetEvent(net_id, 'DISLIKE', m);
    await new domain.net.NetArrange().arrangeNodes(t, event, [parentNodeId]);
    await event.commit(notificationService, t);
    return true;
  });
};
set.paramsSchema = MemberConfirmParamsSchema;
set.responseSchema = Joi.boolean();

export const unSet: THandler<IMemberConfirmParams, boolean> = async (
  { member: actionMember }, { node_id, member_node_id }
) => {
  const m = actionMember!.get();
  let parentNodeId: number | null = node_id;
  let [member] = await execQuery.member
    .find.inTree([parentNodeId, member_node_id]);
  if (!member) {
    parentNodeId = m.parent_node_id;
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
