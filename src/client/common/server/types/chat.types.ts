/* eslint-disable import/no-cycle */
import { MessageTypeKeys } from './messages.types';
import { NetViewKeys } from './net.types';

export type IChatMessage = {
  user_id: number;
  chatId: number;
  index: number;
  message: string;
};

export type IChatSendMessage = {
  node_id: number;
  chatId: number;
  message: string;
};
export type IChatResponseMessage = {
  type: Extract<MessageTypeKeys, 'CHAT'>;
} & IChatMessage | null;

export type IChatGetMessages = {
  node_id: number;
  chatId: number;
  index?: number;
};
export type IChatGetMessagesResponse = IChatMessage[];

export type INetChatIds = Partial<Record<NetViewKeys, number>>;
export type IChatConnectAll = ({ net_id: number } & INetChatIds)[];
