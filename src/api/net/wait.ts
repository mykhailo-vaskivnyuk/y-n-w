import Joi from 'joi';
import { THandler } from '../../controller/types';
import {
  INetConnectByLink,
  INetEnterParams,
  INetReadParams,
  INetWaitingResponse,
  IWaitCreateParams,
} from '../../client/common/server/types/types';
import { NetEvent } from '../../domain/event/event';
import {
  NetConnectByTokenSchema,
  NetEnterParamsSchema,
  NetReadParamsSchema,
  NetWaitingResponseSchema,
  WaitCreateParamsSchema,
} from '../schema/schema';

export const create: THandler<IWaitCreateParams, INetConnectByLink> = async (
  { session },
  { token, comment, test },
) => {
  const user_id = session.read('user_id')!;
  const [net] = await execQuery.net.find.byNetLink([token]);
  if (!net) return null;
  let event!: NetEvent;
  const result = (await domain.utils.exeWithNetLock(net.net_id, async (t) => {
    const [net] = await execQuery.net.find.byNetLink([token]);
    if (!net) return null;

    const { net_id, parent_net_id } = net;
    const [user_exists] = await execQuery.net.find.byUser([net_id, user_id]);
    if (user_exists) return { net_id, error: 'already member or connected' };

    const [waiting] = await execQuery.net.find.byWaitingUser([net_id, user_id]);
    if (waiting) return { net_id, error: 'already waiting' };

    if (parent_net_id) {
      const [parentNet] = await execQuery.net.find.byUser([
        parent_net_id,
        user_id,
      ]);
      if (!parentNet) return { net_id, error: 'not parent net member' };
    }

    if (test) return { net_id };

    /* create new waiting member */
    await t.execQuery.net.wait.create([net_id, user_id, comment]);

    /* create messages */
    const eventType = 'WAIT';
    event = new domain.event.NetEvent(net_id, eventType);
    await event.messages.create(t);
    await event.commit(t);

    return { net_id };
  })) as INetConnectByLink;
  event?.send();
  return result;
};
create.paramsSchema = WaitCreateParamsSchema;
create.responseSchema = NetConnectByTokenSchema;
create.checkNet = false;

export const remove: THandler<INetEnterParams, boolean> = async (
  { session },
  { net_id },
) => {
  const user_id = session.read('user_id')!;
  await execQuery.net.wait.remove([net_id, user_id]);
  return true;
};
remove.paramsSchema = NetEnterParamsSchema;
remove.responseSchema = Joi.boolean();

export const get: THandler<INetReadParams, INetWaitingResponse> = async ({
  member,
}) => {
  const { net_id } = member!.get();
  const result = await execQuery.net.wait.get([net_id]);
  return result;
};
get.paramsSchema = NetReadParamsSchema;
get.responseSchema = NetWaitingResponseSchema;
