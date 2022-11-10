import ws from 'ws';

export interface IWsConfig {
  path: string;
}

export type IWsServer = ws.Server;
