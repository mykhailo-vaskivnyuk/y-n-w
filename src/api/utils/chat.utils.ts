import {
  IChatGetMessages, IChatSendMessage,
} from '../../client/common/api/types/types';
import { IUserNet } from '../../router/types';

export const chatIdVerified = (
  userNet: IUserNet, messageData: IChatSendMessage | IChatGetMessages,
) => {
  const { net_node_id, parent_node_id } = userNet!;
  const { node_id, chatId } = messageData;
  if (chatId === parent_node_id) return true;
  if (chatId === node_id) return true;
  if (chatId === -net_node_id) return true;
  return false;
};
