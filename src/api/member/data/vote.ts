import Joi from 'joi';
import { THandler } from '../../../router/types';
import {
  IMemberConfirmParams,
} from '../../../client/common/server/types/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../../client/common/server/utils';
import { exeWithNetLock } from '../../utils/utils';
import { checkVotes } from '../../utils/vote.utils';
import { createEventMessages } from '../../utils/events/event.messages.create';

export const set: THandler<IMemberConfirmParams, boolean> = async (
  { userNetData }, { member_node_id }
) => {
  const { net_id, node_id, parent_node_id } = userNetData!;
  if (!parent_node_id) return false; // bad request
  const result = await exeWithNetLock(net_id, async () => {
    const [member] = await execQuery
      .member.find.inCircle([parent_node_id, member_node_id]);
    if (!member) return false; // bad request
    if (parent_node_id === member_node_id) return false; // bad request
    const memberStatus = getMemberStatus(member);
    if (memberStatus !== 'ACTIVE') return false; // bad request
    await execQuery.member.data.unsetVote([node_id, member_node_id]);
    await execQuery.member.data
      .setVote([parent_node_id, node_id, member_node_id]);
    return checkVotes(parent_node_id);
  });
  !result && createEventMessages('VOTE', userNetData!);
  return true;
};
set.paramsSchema = MemberConfirmParamsSchema;
set.responseSchema = Joi.boolean();

export const unSet: THandler<IMemberConfirmParams, boolean> = async (
  { userNetData }, { member_node_id }
) => {
  const { node_id, parent_node_id } = userNetData!;
  if (!parent_node_id) return false; // bad request
  const [member] = await execQuery.member
    .find.inCircle([parent_node_id, member_node_id]);
  if (!member) return false; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'ACTIVE') return false; // bad request
  await execQuery.member.data.unsetVote([node_id, member_node_id]);
  createEventMessages('VOTE', userNetData!);
  return true;
};
unSet.paramsSchema = MemberConfirmParamsSchema;
unSet.responseSchema = Joi.boolean();
