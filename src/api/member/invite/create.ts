import Joi from 'joi';
import { JOI_NULL } from '../../../router/constants';
import { THandler } from '../../../router/types';
import { IMemberInviteParams } from '../../../client/common/api/types/types';
import { MemberInviteParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../utils/member.utils';
import { createUnicCode } from '../../../utils/crypto';

const create: THandler<IMemberInviteParams, string | null> = async (
  { session }, { node_id, member_name },
) => {
  const user_node_id = session.read('node_id')!;
  const [member] = await execQuery.member.find([user_node_id, node_id]);
  if (!member) return null; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'EMPTY') return null; // bad request
  const user_id = session.read('user_id')!;
  const token = createUnicCode(15);
  await execQuery.member.inviteCreate([node_id, user_id, member_name, token]);
  return token;
};
create.paramsSchema = MemberInviteParamsSchema;
create.responseSchema = [Joi.string(), JOI_NULL];

export = create;
