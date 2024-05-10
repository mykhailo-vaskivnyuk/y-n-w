import { Context } from 'grammy';

const getUrlFromArg = (origin: string, token: string) => {
  const pathBase64 = token.match(/^path(.+)$/)?.[1];
  if (!pathBase64) return;
  const path = Buffer.from(pathBase64, 'base64').toString();
  return `${origin}/${path}`;
};

export const getOparation = (ctx: Context, origin: string) => {
  const { chat, message } = ctx;
  const chatId = chat?.id.toString();
  if (!chatId) return;
  const { text } = message || {};
  if (!text) return;
  const token = text.match(/^\/start (.+)$/)?.[1];
  if (!token) return;

  const url = getUrlFromArg(origin, token);

  const operation = {
    options: { sessionKey: 'messenger', origin: 'https://t.me' },
    names: 'account/messenger/link/connect'.split('/'),
    data: { params: { chatId, token } },
  };

  return url ? { url } : { operation };
};
