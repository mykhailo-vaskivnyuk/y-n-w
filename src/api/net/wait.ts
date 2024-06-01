import Joi from 'joi';
import { THandler } from '../../controller/types';
import {
  INetConnectByLink, INetEnterParams, ITokenParams,
} from '../../client/common/server/types/types';
import { NetEvent } from '../../domain/event/event';
import {
  TokenParamsSchema, NetConnectByTokenSchema,
  NetEnterParamsSchema,
} from '../schema/schema';

export const create: THandler<ITokenParams, INetConnectByLink> =
  async ({ session }, { token }) => {
    const user_id = session.read('user_id')!;
    const [net] = await execQuery.net.find.byNetLink([token]);
    if (!net) return null;
    let event!: NetEvent;
    const result = await domain.utils.exeWithNetLock(net.net_id, async (t) => {
      const [net] = await execQuery.net.find.byNetLink([token]);
      if (!net) return null;

      const { net_id, parent_net_id } = net;
      const [user_exists] = await execQuery.net.find.byUser([net_id, user_id]);
      if (user_exists) return { net_id, error: 'already member or connected' };

      const [waiting] = await execQuery
        .net.find.byWaitingUser([net_id, user_id]);
      if (waiting) return { net_id, error: 'already waitnig' };

      if (parent_net_id) {
        const [parentNet] = await execQuery
          .net.find.byUser([parent_net_id, user_id]);
        if (!parentNet) return { net_id, error: 'not parent net member' };
      }

      /* create new waiting member */
      await t.execQuery.net.wait.connect([net_id, user_id]);

      /* create messages */
      const eventType = 'WAIT';
      event = new domain.event.NetEvent(net_id, eventType);
      await event.messages.create(t);
      // await event.commit(t);

      return { net_id };
    }) as INetConnectByLink;
    event?.send();
    return result;
  };
create.paramsSchema = TokenParamsSchema;
create.responseSchema = NetConnectByTokenSchema;
create.checkNet = false;

export const remove: THandler<INetEnterParams, boolean> =
  async ({ session }, { net_id }) => {
    const user_id = session.read('user_id')!;
    await execQuery.net.wait.remove([net_id, user_id]);
    return true;
  };
remove.paramsSchema = NetEnterParamsSchema;
remove.responseSchema = Joi.boolean();
