import Joi from 'joi';
import { THandler } from '../../../router/types';
import {
  IMemberConfirmParams,
} from '../../../client/common/server/types/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../../client/common/server/utils';
import { arrangeNodes } from '../../utils/utils';

export const set: THandler<IMemberConfirmParams, boolean> = async (
  { userNet }, { node_id, member_node_id }
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
  await execQuery.member.data
    .setDislike([node_id, member_node_id]);
  // await arrangeNodes([parentNodeId!]);
  return true;
};
set.paramsSchema = MemberConfirmParamsSchema;
set.responseSchema = Joi.boolean();

export const unSet: THandler<IMemberConfirmParams, boolean> = async (
  { userNet }, { node_id, member_node_id }
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
  await execQuery.member.data
    .unsetDislike([node_id, member_node_id]);
  return true;
};
unSet.paramsSchema = MemberConfirmParamsSchema;
unSet.responseSchema = Joi.boolean();
