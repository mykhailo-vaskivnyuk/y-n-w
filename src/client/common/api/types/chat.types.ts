import { NetViewKeys } from './net.types';

export type IChatConnect = {
  node_id: number;
  netView: NetViewKeys;
};

export type IChatConnectResponse = {
  chatId: number;
} | null;

export type IChatMessage = {
  user_id: number;
  index: number;
  message: string;
};

export type IChatSendMessage = {
  node_id: number;
  chatId: number;
  message: string;
};

export type IChatResponseMessage = Omit<IChatMessage, 'message'> & {
  chatId: number;
  message?: string;
} | null;

export type IChatGetMessages = {
  node_id: number;
  chatId: number;
  index?: number;
};

export type IChatGetMessagesResponse = IChatMessage[];
