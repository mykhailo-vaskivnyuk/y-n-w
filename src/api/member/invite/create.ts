import Joi from 'joi';
import { JOI_NULL } from '../../../router/constants';
import { THandler } from '../../../router/types';
import { IMemberInviteParams } from '../../../client/common/api/types/types';
import { MemberInviteParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../utils/member.utils';
import { findUserNet } from '../../utils/net.utils';
import { createUnicCode } from '../../../utils/crypto';

const create: THandler<IMemberInviteParams, string | null> = async (
  { session }, { net_node_id, node_id, member_name },
) => {
  const user_id = session.read('user_id')!;
  const [net, user_status] = await findUserNet(user_id, net_node_id);
  if (user_status !== 'INSIDE_NET') return null;
  const { node_id: parent_node_id } = net!;
  const [member] = await execQuery.member.findInTree([parent_node_id, node_id]);
  if (!member) return null; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'EMPTY') return null; // bad request
  const token = createUnicCode(15);
  await execQuery.member
    .inviteCreate([parent_node_id, node_id, member_name, token]);
  return token;
};
create.paramsSchema = MemberInviteParamsSchema;
create.responseSchema = [Joi.string(), JOI_NULL];

export = create;
