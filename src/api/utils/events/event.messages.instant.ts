import { IMemberAndNet } from '../../../db/types/member.types';
import { NetEventKeys } from '../../../client/common/server/types/types';
import {
  IEventMessage, NetViewKeys,
} from '../../../client/common/server/types/types';
import {
  NET_MESSAGES_MAP, INSTANT_EVENTS,
} from '../../../constants/constants';
import { sendNotification } from './event.messages.notify';

export const sendInstantMessage = (
  event: NetEventKeys,
  user_id: number,
  net_id: number,
  net_view: NetViewKeys,
) => {
  // change logic as in createMessagesInNet
  const chatId = chatService.getChatIdOfUser(user_id);
  if (!chatId) return;
  const connectionIds = chatService.getChatConnections(chatId);
  const response: IEventMessage = {
    type: 'EVENT',
    event_id: 0,
    user_id,
    net_id,
    net_view,
    from_node_id: null,
    event_type: event,
    message: '',
    date: '',
  };
  connectionService.sendMessage(response, connectionIds);
};

export const sendInstantMessageInNet = async (
  event: NetEventKeys,
  fromMember: IMemberAndNet,
  message: string,
  date: string,
) => {
  const { net: chatId } = chatService.getChatIdsOfNet(fromMember);
  if (!chatId) return;
  const connectionIds = chatService.getChatConnections(chatId);
  const response: IEventMessage = {
    type: 'EVENT',
    event_id: 0,
    user_id: 0,
    net_id: fromMember.net_id,
    net_view: 'net',
    from_node_id: fromMember.node_id,
    event_type: event,
    message,
    date,
  };
  connectionService.sendMessage(response, connectionIds);

  for (const connectionId of connectionIds!.values()) {
    const user_id = chatService.getUserByConnectionId(connectionId);
    execQuery.user.events.write([user_id!, date]);
  }

  const users = await execQuery.net.users.toNotify([fromMember.net_id]);
  for (const { user_id } of users) sendNotification(user_id, date);
};

export const createInstantMessageInNet = (
  event: NetEventKeys,
  fromMember: IMemberAndNet,
  date: string,
) => {
  if (!INSTANT_EVENTS.includes(event)) return;
  const message = NET_MESSAGES_MAP[event]['NET'];
  if (message === undefined) return;
  sendInstantMessageInNet(event, fromMember, message, date);
};
