import {
  IChatGetMessages, IChatMessage, IChatSendMessage,
} from '../../client/common/api/types/types';
import {
  MAX_CHAT_MESSAGE_COUNT, MAX_CHAT_MESSAGE_INDEX,
} from '../../constants/constants';

export class ChatService {
  private messages = new Map<number, IChatMessage[]>();

  addMessage(user_id: number, messageData: IChatSendMessage) {
    const { chatId, message } = messageData;
    const chatMessages = this.messages.get(chatId);
    if (!message) return { chatId, user_id, index: 0 };
    let index: number;
    if (chatMessages) {
      const { index: lastIndex } = chatMessages.at(-1)!;
      index = (lastIndex % MAX_CHAT_MESSAGE_INDEX) + 1;
      chatMessages.push({ user_id, index, message });
      chatMessages.length > MAX_CHAT_MESSAGE_COUNT && chatMessages.shift();
    } else {
      index = 1;
      this.messages.set(chatId, [{ user_id, index, message }]);
    }
    return { chatId, user_id, index, message };
  }

  getMessages({ chatId, index = 1 }: IChatGetMessages) {
    const chatMessages = this.messages.get(chatId);
    if (!chatMessages) return [];
    const { index: lastIndex } = chatMessages.at(-1)!;
    const count = lastIndex - index + 1;
    if (count < 1) return [];
    const allCount = chatMessages.length;
    const messages = chatMessages.slice(-Math.min(count, allCount));
    return messages;
  }
}

export default () => new ChatService();
