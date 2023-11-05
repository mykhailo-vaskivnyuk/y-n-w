import {
  IChatGetMessages, IChatSendMessage,
} from '../../client/common/server/types/types';
import { Member } from '../../domain/member/member';

export const chatIdVerified = (
  member: Member,
  messageData: IChatSendMessage | IChatGetMessages,
) => {
  const { net_id, node_id, parent_node_id } = member.get();
  const { chatId } = messageData;
  const { net_id: netId, node_id: nodeId } =
    chatService.getUserNetNode(chatId) || {};
  if (net_id === netId) return true;
  if (parent_node_id === nodeId) return true;
  if (node_id === nodeId) return true;
  return false;
};
