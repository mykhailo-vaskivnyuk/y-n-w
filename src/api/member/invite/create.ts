import Joi from 'joi';
import { JOI_NULL } from '../../../router/constants';
import { THandler } from '../../../router/types';
import { IMemberInviteParams } from '../../../client/common/api/types/types';
import { MemberInviteParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../utils/member.utils';
import { createUnicCode } from '../../../utils/crypto';
import { findUserNet, getNetUserStatus } from '../../utils/net.utils';
import { HandlerError } from '../../../router/errors';

const create: THandler<IMemberInviteParams, string | null> = async (
  { session }, { net_id, node_id, member_name },
) => {
  const user_id = session.read('user_id')!;
  const net = await findUserNet(user_id, net_id);
  const user_status = getNetUserStatus(net);
  if (user_status !== 'INSIDE_NET') return null;
  if (!net) throw new HandlerError('NOT_FOUND');
  const [member] = await execQuery.member.find([net.node_id, node_id]);
  if (!member) return null; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'EMPTY') return null; // bad request
  const token = createUnicCode(15);
  await execQuery.member.inviteCreate([node_id, user_id, member_name, token]);
  return token;
};
create.paramsSchema = MemberInviteParamsSchema;
create.responseSchema = [Joi.string(), JOI_NULL];

export = create;
