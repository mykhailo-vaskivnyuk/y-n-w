export const sendNotification = async (user_id: number, date: string) => {
  const [user] = await execQuery.user.get([user_id]);
  const { chat_id: tgChatId } = user!;
  if (!tgChatId) return;
  messengerService.sendNotification(tgChatId);
  execQuery.user.events.write([user_id, date]);
};

export const commitEvents = (user_id: number, date: string) => {
  const chatId = chatService.getChatIdOfUser(user_id);
  if (!chatId) return sendNotification(user_id, date);
  const connectionIds = chatService.getChatConnections(chatId);
  connectionService.sendMessage({ type: 'NEW_EVENTS' }, connectionIds);
};
