import { format } from 'node:util';
import { IMember } from '../../../db/types/member.types';
import { NetEventKeys } from '../../../client/common/server/types/types';
import { ITableNetsData } from '../../../db/types/db.tables.types';
import {
  NET_MESSAGES_MAP, SET_USER_NODE_ID_FOR,
} from '../../../constants/constants';
import { commitEvents } from './event.messages.notify';

export const createMessagesToConnected = async (
  event: NetEventKeys,
  netData: ITableNetsData,
  user_ids: number[],
  date: string,
) => {
  const { name } = netData;
  const message = format(NET_MESSAGES_MAP[event]['CONNECTED'], name);
  for (const user_id of user_ids) {
    await execQuery.events.create([
      user_id,
      null,
      null,
      null,
      event,
      message,
      date,
    ]);
    await commitEvents(user_id, date);
  }
};

export const createMessageToMember = async (
  event: NetEventKeys,
  fromMember: IMember,
  date: string,
) => {
  let message = NET_MESSAGES_MAP[event].MEMBER;
  if (!message) return;
  const { user_id, node_id, net_id } = fromMember;
  const [net] = await execQuery.net.data.get([net_id]);
  const { name } = net!;
  const user_node_id = SET_USER_NODE_ID_FOR.includes(event) ? node_id : null;
  if (!user_node_id) message = format(message, name);
  await execQuery.events.create([
    user_id,
    net_id,
    'net',
    null,
    event,
    message,
    date,
  ]);
  await commitEvents(user_id, date);
};
