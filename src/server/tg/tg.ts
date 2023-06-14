/* eslint-disable max-lines */
import { Bot, BotError, Context, InlineKeyboard } from 'grammy';
import { THandleOperation } from '../../types/operation.types';
import { IInputConnection } from '../types';
import { ITgConfig, ITgServer } from './types';
import { ServerError } from '../errors';

class TgConnection implements IInputConnection {
  private exec?: THandleOperation;
  private server: ITgServer;

  constructor(config: ITgConfig) {
    this.server = new Bot(config.token);
    this.server.on('message', this.handleRequest.bind(this));
    this.server.catch(this.handleError.bind(this));
  }

  onOperation(cb: THandleOperation) {
    this.exec = cb;
  }

  setUnavailable() {
    return;
  }

  getServer() {
    return this.server;
  }

  async start() {
    if (!this.exec) {
      const e = new ServerError('NO_CALLBACK');
      logger.error(e);
      throw e;
    }

    try {
      await new Promise((onStart, onError) => {
        this.server.start({ onStart }).catch(onError);
      });
    } catch (e: any) {
      logger.error(e);
      throw new ServerError('LISTEN_ERROR');
    }
  }

  async stop() {
    return this.server.stop();
  }

  private async handleRequest(ctx: Context) {
    const operation = this.getOparation(ctx);
    if (!operation) return ctx.reply('unknown command');
    try {
      const result = await this.exec!(operation);
      if (!result) await ctx.reply('bad command');
      else await ctx.reply('success');
    } catch {
      await ctx.reply('error');
    }
  }

  private getOparation(ctx: Context) {
    const chatId = ctx.chat?.id.toString();
    if (!chatId) return;
    const { text } = ctx.message || {};
    if (!text) return;
    const token = text.match(/^\/start (.+)/)?.[1];
    if (!token) return;
    return {
      options: { sessionKey: 'messenger', origin: 't.me' },
      names: 'account/messenger/link/connect'.split('/'),
      data: { params: { chatId, token } },
    };
  }

  private sendNotification(chatId: string) {
    const appName = 'You & World';
    const message = `На сайті ${appName} нові події`;
    const link = 'https://merega.herokuapp.com';
    const inlineKyeboard = new InlineKeyboard()
      .url(appName, link);
    this.server.api.sendMessage(chatId, message, {
      reply_markup: inlineKyeboard,
    });
    return true;
  }

  private handleError(error: BotError) {
    const details = (error.error as any)?.message || {};
    throw new ServerError('SERVER_ERROR', details);
  }

  getConnectionService() {
    return {
      sendMessage: () => false,
      sendNotification: this.sendNotification.bind(this),
    };
  }
}

export = TgConnection;
