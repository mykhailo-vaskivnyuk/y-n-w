import { Bot } from 'grammy';

export interface ITgConfig {
  path: string;
  token: string;
  user_name: string;
}

export type ITgServer = Bot<any, any>;

