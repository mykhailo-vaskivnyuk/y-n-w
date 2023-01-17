export type IChatMessage = {
  user_id: number;
  index: number;
  message: string;
};

export type IChatSendMessage = {
  node_id: number;
  chatId: number;
  message?: string;
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
