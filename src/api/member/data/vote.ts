import Joi from 'joi';
import { THandler } from '../../../router/types';
import { IMemberConfirmParams } from '../../../client/common/api/types/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../utils/member.utils';
import { findUserNet } from '../../utils/net.utils';
import { HandlerError } from '../../../router/errors';

export const set: THandler<IMemberConfirmParams, boolean> = async (
  { session }, { net_node_id, node_id }
) => {
  const user_id = session.read('user_id')!;
  const net = await findUserNet(user_id, net_node_id);
  if (!net) throw new HandlerError('NOT_FOUND');
  if (!net.parent_node_id) return false; // bad request
  const [member] = await execQuery.member
    .findInCircle([net.parent_node_id, node_id]);
  if (!member) return false; // bad request
  if (+net.parent_node_id === node_id) return false; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'ACTIVE') return false; // bad request
  await execQuery.member.data.unsetVote([net.parent_node_id, user_id]);
  await execQuery.member.data
    .setVote([net.parent_node_id, user_id, member.user_id]);
  return true;
};
set.paramsSchema = MemberConfirmParamsSchema;
set.responseSchema = Joi.boolean();

export const unSet: THandler<IMemberConfirmParams, boolean> = async (
  { session }, { net_node_id, node_id }
) => {
  const user_id = session.read('user_id')!;
  const net = await findUserNet(user_id, net_node_id);
  if (!net) throw new HandlerError('NOT_FOUND');
  if (!net.parent_node_id) return false; // bad request
  const [member] = await execQuery.member
    .findInCircle([net.parent_node_id, node_id]);
  if (!member) return false; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'ACTIVE') return false; // bad request
  await execQuery.member.data.unsetVote([net.parent_node_id, user_id]);
  return true;
};
unSet.paramsSchema = MemberConfirmParamsSchema;
unSet.responseSchema = Joi.boolean();
