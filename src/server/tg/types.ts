import { Api, Bot, Context } from 'grammy';

export interface ITgConfig {
  path: string;
  token: string;
  user_name: string;
  origin: string;
}

export type ITgServer = Bot<Context, Api>;
