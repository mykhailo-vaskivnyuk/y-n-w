import Joi from 'joi';
import { THandler } from '../../../router/types';
import { IMemberConfirmParams } from '../../../client/common/api/types/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../utils/member.utils';
import { checkVotes } from '../../utils/net.utils';

export const set: THandler<IMemberConfirmParams, boolean> = async (
  { session, userNet }, { member_node_id }
) => {
  const { parent_node_id } = userNet!;
  if (!parent_node_id) return false; // bad request
  const [member] = await execQuery.member
    .findInCircle([parent_node_id, member_node_id]);
  if (!member) return false; // bad request
  if (+parent_node_id === member_node_id) return false; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'ACTIVE') return false; // bad request
  const user_id = session.read('user_id')!;
  await execQuery.member.data.unsetVote([parent_node_id, user_id]);
  await execQuery.member.data
    .setVote([parent_node_id, user_id, member.user_id!]);
  await checkVotes(parent_node_id);
  return true;
};
set.paramsSchema = MemberConfirmParamsSchema;
set.responseSchema = Joi.boolean();

export const unSet: THandler<IMemberConfirmParams, boolean> = async (
  { session, userNet }, { member_node_id }
) => {
  const { parent_node_id } = userNet!;
  if (!parent_node_id) return false; // bad request
  const [member] = await execQuery.member
    .findInCircle([parent_node_id, member_node_id]);
  if (!member) return false; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'ACTIVE') return false; // bad request
  const user_id = session.read('user_id')!;
  await execQuery.member.data.unsetVote([parent_node_id, user_id]);
  return true;
};
unSet.paramsSchema = MemberConfirmParamsSchema;
unSet.responseSchema = Joi.boolean();
