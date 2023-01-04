import Joi from 'joi';
import { THandler } from '../../../router/types';
import { IMemberConfirmParams } from '../../../client/common/api/types/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { updateCountOfMemebers } from '../../utils/utils';
import { getMemberStatus } from '../../utils/member.utils';
import { findUserNet } from '../../utils/net.utils';
import { HandlerError } from '../../../router/errors';

const refuse: THandler<IMemberConfirmParams, boolean> = async (
  { session }, { net_id, node_id }
) => {
  const user_id = session.read('user_id')!;
  const net = await findUserNet(user_id, net_id);
  if (!net) throw new HandlerError('NOT_FOUND');
  const [member] = await execQuery.member.findInTree([net.node_id, node_id]);
  if (!member) return false; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'CONNECTED') return false; // bad request
  await execQuery.member.inviteRemove([node_id]);
  const { user_id: memberId } = member;
  await execQuery.net.nodes.removeUser([net_id, memberId!]);
  await execQuery.net.user.remove([net_id, memberId!]);
  await updateCountOfMemebers(member, -1);
  return true;
};
refuse.paramsSchema = MemberConfirmParamsSchema;
refuse.responseSchema = Joi.boolean();

export = refuse;
