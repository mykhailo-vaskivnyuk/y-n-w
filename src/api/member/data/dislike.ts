import Joi from 'joi';
import { THandler } from '../../../router/types';
import { IMemberConfirmParams } from '../../../client/common/api/types/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../utils/member.utils';
import { arrangeNodes } from '../../utils/utils';

export const set: THandler<IMemberConfirmParams, boolean> = async (
  { session, userNet }, { node_id, member_node_id }
) => {
  let parentNodeId: number | null = node_id;
  let [member] = await execQuery.member
    .findInTree([parentNodeId, member_node_id]);
  if (!member) {
    parentNodeId = userNet!.parent_node_id;
    [member] = await execQuery.member
      .findInCircle([parentNodeId, member_node_id]);
    if (!member) return false; // bad request
  }
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'ACTIVE') return false; // bad request
  const user_id = session.read('user_id')!;
  await execQuery.member.data
    .setDislike([parentNodeId!, user_id, member.user_id!]);
  await arrangeNodes([parentNodeId!]);
  return true;
};
set.paramsSchema = MemberConfirmParamsSchema;
set.responseSchema = Joi.boolean();

export const unSet: THandler<IMemberConfirmParams, boolean> = async (
  { session, userNet }, { node_id, member_node_id }
) => {
  let parentNodeId: number | null = node_id;
  let [member] = await execQuery.member
    .findInTree([parentNodeId, member_node_id]);
  if (!member) {
    parentNodeId = userNet!.parent_node_id;
    [member] = await execQuery.member
      .findInCircle([parentNodeId, member_node_id]);
    if (!member) return false; // bad request
  }
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'ACTIVE') return false; // bad request
  const user_id = session.read('user_id')!;
  await execQuery.member.data
    .unsetDislike([parentNodeId!, user_id, member.user_id!]);
  return true;
};
unSet.paramsSchema = MemberConfirmParamsSchema;
unSet.responseSchema = Joi.boolean();
