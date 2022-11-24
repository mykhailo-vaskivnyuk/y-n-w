import Joi from 'joi';
import { THandler } from '../../../router/types';
import { updateCountOfMemebers } from '../../utils/utils';

const leave: THandler = async ({ session }) => {
  session.delete('node_id');
  const net_id = await session.read('net_id');
  session.delete('net_id');
  const user_id = await session.read('user_id');
  await execQuery.net.user.remove([net_id!, user_id!]);
  const nodes = await execQuery.user.net.getNodes([user_id!, net_id!]);
  await execQuery.net.nodes.removeUser([net_id!, user_id!]);
  for (const node of nodes) await updateCountOfMemebers(node!, -1);
  session.write('user_state', 'LOGGEDIN');
  return true;
};
leave.responseSchema = Joi.boolean();

export = leave;
