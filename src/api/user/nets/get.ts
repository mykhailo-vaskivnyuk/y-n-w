import {
  IWaitNets,
  INetsResponse,
} from '../../../client/common/server/types/types';
import { THandler } from '../../../controller/types';
import { NetsResponseSchema, WaitNetsSchema } from '../../schema/schema';

export const all: THandler<never, INetsResponse> = async ({ session }) => {
  const user_id = session.read('user_id');
  const nets = await execQuery.user.nets.getAll([user_id!]);
  return nets;
};
all.responseSchema = NetsResponseSchema;

export const wait: THandler<never, IWaitNets> = async ({ session }) => {
  const user_id = session.read('user_id');
  const nets = await execQuery.user.nets.getWait([user_id!]);
  return nets;
};
wait.responseSchema = WaitNetsSchema;
