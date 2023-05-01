import { IMemberAndNet } from '../../../db/types/member.types';
import { NetEventKeys } from '../../../client/common/server/types/types';
import {
  IEventMessage, NetViewKeys,
} from '../../../client/common/server/types/types';
import {
  NET_MESSAGES_MAP, INSTANT_EVENTS,
} from '../../../constants/constants';

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

export const sendInstantMessageInNet = (
  event: NetEventKeys,
  fromMember: IMemberAndNet,
  message: string,
) => {
  const { net: chatId } = chatService.getChatIdsOfNet(fromMember);
  if (!chatId) return;
  // const { user_id, node_id: user_node_id } = memberNet;
  // const userChatId = chatService.getChatIdOfUser(user_id)!;
  const netConnectionIds = chatService.getChatConnections(chatId);
  // const userConnectionId =
  //   chatService.getChatConnections(userChatId)!
  //     .values().next().value as number;
  const response: IEventMessage = {
    type: 'EVENT',
    event_id: 0,
    user_id: 0,
    net_id: fromMember.net_id,
    net_view: 'net',
    from_node_id: fromMember.node_id,
    event_type: event,
    message,
    date: '',
  };
  // const connectionIds = new Set(netConnectionIds);
  // userConnectionId && connectionIds.delete(userConnectionId);
  connectionService.sendMessage(response, netConnectionIds);
};

export const createInstantMessageInNet = (
  event: NetEventKeys,
  fromMember: IMemberAndNet,
) => {
  const message = NET_MESSAGES_MAP[event]['NET'];
  if (message === undefined) return;
  if (!INSTANT_EVENTS.includes(event)) return;
  sendInstantMessageInNet(event, fromMember, message);
};
