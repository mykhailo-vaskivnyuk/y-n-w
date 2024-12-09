import { Api, Bot, Context } from 'grammy';

export interface ITgConfig {
  path: string;
  token: string;
  user_name: string;
  origin: string;
  dev: boolean;
}

export type ITgServer = Bot<Context, Api>;
