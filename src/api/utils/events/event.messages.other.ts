import { format } from 'node:util';
import { IMember, IMemberNode } from '../../../db/types/member.types';
import { ITableNetsData } from '../../../db/types/db.tables.types';
import { NetEvent } from '../../../services/event/event';
import {
  INSTANT_EVENTS,
  NET_MESSAGES_MAP, SET_USER_NODE_ID_FOR,
} from '../../../constants/constants';

export const createMessagesToConnected = async (
  event: NetEvent,
  netData: ITableNetsData,
  user_ids: number[],
) => {
  const { name } = netData;
  const { event_type } = event;
  const message = format(NET_MESSAGES_MAP[event_type]['CONNECTED'], name);

  for (const user_id of user_ids) {
    event.addOutNetEvent({ user_id, message });
  }
};

export const createMessageToMember = async (
  event: NetEvent,
  from: IMember,
) => {
  const { event_type } = event;
  let message = NET_MESSAGES_MAP[event_type].MEMBER;
  if (!message) return;
  const { user_id, node_id, net_id } = from;
  const [net] = await execQuery.net.data.get([net_id]);
  const { name } = net!;
  const user_node_id =
    SET_USER_NODE_ID_FOR.includes(event_type) ? node_id : null;
  if (!user_node_id) message = format(message, name);
  event.addEvent({ user_id, net_view: 'net', from_node_id: null, message });
};

export const createInstantMessageInNet = (
  event: NetEvent,
  from: IMemberNode,
) => {
  const { event_type } = event;
  if (!INSTANT_EVENTS.includes(event_type)) return;
  const message = NET_MESSAGES_MAP[event_type]['NET'];
  if (message === undefined) return;
  notificationService.addNetEvent({ event_type, message }, from);
};
