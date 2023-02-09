import Joi from 'joi';
import { THandler } from '../../../router/types';
import { IMemberConfirmParams } from '../../../client/common/server/types/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../../client/common/server/utils';
import { checkVotes } from '../../utils/vote.utils';
import { createMessages } from '../../utils/messages.create.utils';

export const set: THandler<IMemberConfirmParams, boolean> = async (
  { session, userNet }, { member_node_id }
) => {
  const { parent_node_id } = userNet!;
  if (!parent_node_id) return false; // bad request
  const [member] = await execQuery.member
    .findInCircle([parent_node_id, member_node_id]);
  if (!member) return false; // bad request
  if (parent_node_id === member_node_id) return false; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'ACTIVE') return false; // bad request
  const user_id = session.read('user_id')!;
  await execQuery.member.data.unsetVote([parent_node_id, user_id]);
  await execQuery.member.data
    .setVote([parent_node_id, user_id, member.user_id!]);
  const result = await checkVotes(parent_node_id);
  !result && createMessages('VOTE', userNet!);
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
  createMessages('VOTE', userNet!);
  return true;
};
unSet.paramsSchema = MemberConfirmParamsSchema;
unSet.responseSchema = Joi.boolean();
