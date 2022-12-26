import Joi from 'joi';
import { THandler } from '../../router/types';
import { updateCountOfMemebers } from '../utils/utils';

const leave: THandler = async ({ session }) => {
  const user_id = await session.read('user_id');
  const net_id = await session.read('net_id');
  const nodes = await execQuery.user.net.getNodes([user_id!, net_id!]);
  await execQuery.net.nodes.removeUser([net_id!, user_id!]);
  await execQuery.user.net.removeInvites([net_id!, user_id!]);
  await execQuery.net.user.remove([net_id!, user_id!]);
  for (const node of nodes) await updateCountOfMemebers(node!, -1);
  session.delete('net_id');
  session.delete('node_id');
  session.write('user_status', 'LOGGEDIN');
  return true;
};
leave.responseSchema = Joi.boolean();

export = leave;
