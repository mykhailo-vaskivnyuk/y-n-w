import ws from 'ws';

export interface IWsConfig {
  path: string;
}

export type IWsServer = ws.Server<IWsConnection>;
export type IWsConnection = ws.WebSocket & { isAlive?: boolean };
