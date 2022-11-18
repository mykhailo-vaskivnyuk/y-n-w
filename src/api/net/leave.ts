import Joi from 'joi';
import { THandler } from '../../router/types';
import { updateCountOfMemebers } from '../utils/utils';

const leave: THandler = async ({ session }) => {
  const user_id = await session.read('user_id');
  const node_id = await session.read('node_id');
  const net_id = await session.read('net_id');
  const [node] = await execQuery.node.user.remove([node_id!]);
  session.delete('node_id');
  await execQuery.net.user.remove([user_id!, net_id!]);
  session.delete('net_id');
  await updateCountOfMemebers(node!, -1);
  return true;
};
leave.responseSchema = Joi.boolean();

export = leave;
