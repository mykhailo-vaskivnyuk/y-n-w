import { THandler } from '../../controller/types';
import {
  INetConnectByToken, ITokenParams,
} from '../../client/common/server/types/types';
import { IMember } from '../../domain/types/member.types';
import { TokenParamsSchema, NetConnectByTokenSchema } from '../schema/schema';

const connectByToken: THandler<ITokenParams, INetConnectByToken> =
  async ({ session }, { token }) => {
    const user_id = session.read('user_id')!;
    const [net] = await execQuery.net.find.byToken([token]);
    if (!net) return null;
    return domain.utils.exeWithNetLock(net.net_id, async (t) => {
      const [net] = await execQuery.net.find.byToken([token]);
      if (!net) return null;
      const { parent_net_id, net_id, parent_node_id, node_id } = net;
      const [user_exists] = await execQuery.net.find.byUser([net_id, user_id]);
      if (user_exists) return { net_id, error: 'already connected' };

      if (parent_net_id) {
        const [parentNet] = await execQuery
          .net.find.byUser([parent_net_id, user_id]);
        if (!parentNet) return { net_id, error: 'not parent net member' };
      }

      /* remove token */
      await t.execQuery.member.invite.remove([node_id]);

      /* create new member */
      await t.execQuery.member.connect([node_id, user_id]);

      /* create messages */
      const newMember = { parent_node_id, node_id } as IMember;
      const event = new domain.event.NetEvent(net_id, 'CONNECT', newMember);
      await event.messages.create(t);
      await event.commit(notificationService, t);

      return { net_id };
    });
  };
connectByToken.paramsSchema = TokenParamsSchema;
connectByToken.responseSchema = NetConnectByTokenSchema;
connectByToken.checkNet = false;

export = connectByToken;
