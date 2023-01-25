import {
  IChatGetMessages, IChatSendMessage,
} from '../../client/common/api/types/types';
import { IUserNet } from '../../db/types/member.types';

export const chatIdVerified = (
  userNet: IUserNet, messageData: IChatSendMessage | IChatGetMessages,
) => {
  const { net_node_id, node_id, parent_node_id } = userNet!;
  const { chatId } = messageData;
  const { net_node_id: netNodeId, node_id: nodeId } =
    chatService.getUserNetNode(chatId) || {};
  if (net_node_id === netNodeId) return true;
  if (parent_node_id === nodeId) return true;
  if (node_id === nodeId) return true;
  return false;
};
