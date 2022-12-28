import Joi from 'joi';
import { IMemberConfirmParams } from '../../../client/common/api/types/types';
import { HandlerError } from '../../../router/errors';
import { THandler } from '../../../router/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../utils/member.utils';
import { findUserNet } from '../../utils/net.utils';

const confirm: THandler<IMemberConfirmParams, boolean> = async (
  { session }, { net_id, node_id }
) => {
  const user_id = session.read('user_id')!;
  const net = await findUserNet(user_id, net_id);
  if (!net) throw new HandlerError('NOT_FOUND');
  const [member] = await execQuery.member.find([net.node_id, node_id]);
  if (!member) return false; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'CONNECTED') return false; // bad request
  await execQuery.member.inviteRemove([node_id]);
  return true;
};
confirm.paramsSchema = MemberConfirmParamsSchema;
confirm.responseSchema = Joi.boolean();

export = confirm;
