import {
  IChatResponseMessage, IChatSendMessage,
} from '../../client/common/api/types/types';
import { OmitNull } from '../../client/common/types';
import {
  MAX_CHAT_MESSAGE_COUNT, MAX_CHAT_MESSAGE_INDEX,
} from '../../constants/constants';

export class ChatService {
  private messages = new Map<number, OmitNull<IChatResponseMessage>[]>();

  addMessage(user_id: number, messageData: IChatSendMessage) {
    const { chatId, message } = messageData;
    const chatMessages = this.messages.get(chatId);
    let responseMessage;
    if (!message) {
      responseMessage = { ...messageData, user_id, index: 0 };
    } else if (chatMessages) {
      const { index: lastIndex } = chatMessages.at(-1)!;
      const nextIndex = (lastIndex % MAX_CHAT_MESSAGE_INDEX) + 1;
      responseMessage = { ...messageData, user_id, index: nextIndex };
      chatMessages.push(responseMessage);
      chatMessages.length > MAX_CHAT_MESSAGE_COUNT && chatMessages.shift();
    } else {
      responseMessage = { ...messageData, user_id, index: 1 };
      this.messages.set(chatId, [responseMessage]);
    }
    return responseMessage;
  }

  getMessages(chatId: number, index = 1) {
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
