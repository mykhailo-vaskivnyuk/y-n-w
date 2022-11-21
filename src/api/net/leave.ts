import Joi from 'joi';
import { THandler } from '../../router/types';
import { updateCountOfMemebers } from '../utils/utils';

const leave: THandler = async ({ session }) => {
  session.delete('node_id');
  const net_id = await session.read('net_id');
  session.delete('net_id');
  session.write('user_state', 'LOGGEDIN');
  const user_id = await session.read('user_id');
  const nodes = await execQuery.nodes.user.remove([user_id!, net_id!]);
  await execQuery.nets.user.remove([user_id!, net_id!]);
  for (const node of nodes) await updateCountOfMemebers(node!, -1);
  return true;
};
leave.responseSchema = Joi.boolean();

export = leave;
