import Joi from 'joi';
import { THandler } from '../../../router/types';
import {
  IMemberConfirmParams,
} from '../../../client/common/server/types/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../../client/common/server/utils';
import { arrangeNodes } from '../../utils/utils';

export const set: THandler<IMemberConfirmParams, boolean> = async (
  { userNetData }, { node_id, member_node_id }
) => {
  let parentNodeId: number | null = node_id;
  let [member] = await execQuery.member
    .find.inTree([parentNodeId, member_node_id]);
  if (!member) {
    parentNodeId = userNetData!.parent_node_id;
    if (!parentNodeId) return false; // bad request
    [member] = await execQuery.member
      .find.inCircle([parentNodeId, member_node_id]);
    if (!member) return false; // bad request
  }
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'ACTIVE') return false; // bad request
  logger.fatal(parentNodeId, node_id, member_node_id);
  await execQuery.member.data
    .setDislike([parentNodeId, node_id, member_node_id]);
  await arrangeNodes([parentNodeId!]);
  return true;
};
set.paramsSchema = MemberConfirmParamsSchema;
set.responseSchema = Joi.boolean();

export const unSet: THandler<IMemberConfirmParams, boolean> = async (
  { userNetData }, { node_id, member_node_id }
) => {
  let parentNodeId: number | null = node_id;
  let [member] = await execQuery.member
    .find.inTree([parentNodeId, member_node_id]);
  if (!member) {
    parentNodeId = userNetData!.parent_node_id;
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
