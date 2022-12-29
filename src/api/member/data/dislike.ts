import Joi from 'joi';
import { THandler } from '../../../router/types';
import { IMemberConfirmParams } from '../../../client/common/api/types/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
// import { updateCountOfMemebers } from '../utils/utils';
import { getMemberStatus } from '../../utils/member.utils';
import { findUserNet } from '../../utils/net.utils';
import { HandlerError } from '../../../router/errors';

export const set: THandler<IMemberConfirmParams, boolean> = async (
  { session }, { net_id, node_id }
) => {
  const user_id = session.read('user_id')!;
  const net = await findUserNet(user_id, net_id);
  if (!net) throw new HandlerError('NOT_FOUND');
  const [member] = await execQuery.member.find([net.node_id, node_id]);
  if (!member) return false; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'ACTIVE') return false; // bad request
  // await execQuery.member.setDislike([node_id]);
  return true;
};
set.paramsSchema = MemberConfirmParamsSchema;
set.responseSchema = Joi.boolean();

export const unSet: THandler<IMemberConfirmParams, boolean> = async (
  { session }, { net_id, node_id }
) => {
  const user_id = session.read('user_id')!;
  const net = await findUserNet(user_id, net_id);
  if (!net) throw new HandlerError('NOT_FOUND');
  const [member] = await execQuery.member.find([net.node_id, node_id]);
  if (!member) return false; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'ACTIVE') return false; // bad request
  // await execQuery.member.setDislike([node_id]);
  return true;
};
unSet.paramsSchema = MemberConfirmParamsSchema;
unSet.responseSchema = Joi.boolean();
