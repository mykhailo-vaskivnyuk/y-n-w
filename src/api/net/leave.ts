import Joi from 'joi';
import { INetReadParams } from '../../client/common/api/types/types';
import { THandler } from '../../router/types';
import { NetReadParamsSchema } from '../schema/schema';
import { HandlerError } from '../../router/errors';
import { findUserNet } from '../utils/net.utils';
import { updateCountOfMemebers } from '../utils/utils';

const leave: THandler<INetReadParams> = async ({ session }, { net_id }) => {
  const user_id = session.read('user_id')!;
  const net = await findUserNet(user_id, net_id);
  if (!net) throw new HandlerError('NOT_FOUND');
  const nodes = await execQuery.user.net.getNodes([user_id!, net_id!]);
  await execQuery.net.nodes.removeUser([net_id!, user_id!]);
  await execQuery.user.members.removeInvites([net_id!, user_id!]);
  await execQuery.user.members.removeData([null, user_id!]);
  await execQuery.net.user.remove([net_id!, user_id!]);
  for (const node of nodes) await updateCountOfMemebers(node!, -1);
  return true;
};
leave.paramsSchema = NetReadParamsSchema;
leave.responseSchema = Joi.boolean();

export = leave;
