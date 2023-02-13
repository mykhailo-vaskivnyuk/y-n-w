/* eslint-disable max-lines */
import { IMember } from '../../../db/types/member.types';
import { NetEventKeys } from '../../types/net.types';
import {
  IEventMessage, NetViewKeys,
} from '../../../client/common/server/types/types';
import {
  NET_MESSAGES_MAP, INSTANT_EVENTS,
} from '../../../constants/constants';

export const sendInstantMessage = (
  user_id: number, net_id: number, net_view: NetViewKeys,
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
    message: '',
    date: '',
  };
  connectionService.sendMessage(response, connectionIds);
};

export const sendInstantMessageInNet = (
  fromMember: IMember, message: string,
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
    message,
    date: '',
  };
  // const connectionIds = new Set(netConnectionIds);
  // userConnectionId && connectionIds.delete(userConnectionId);
  connectionService.sendMessage(response, netConnectionIds);
};

/**
 * createEventMessages
 * api.net.board.clear
 */
export const createInstantMessageInNet = (
  event: NetEventKeys,
  fromMember: IMember,
) => {
  const message = NET_MESSAGES_MAP[event]['NET'];
  if (message === undefined) return;
  if (!INSTANT_EVENTS.includes(event)) return;
  sendInstantMessageInNet(fromMember, message);
};
