import * as P from './types';

export type TMemberInviteCreateResponse = string | null;
export type TNetChatSend = {
  node_id: number;
  chatId: number;
  message: string;
};
export type TNetChatSendResponse = null | {
  chatId: number;
  message: string;
};
export type TNetConnectByTokenResponse = null | {
  net_node_id: number;
  error?: string;
};
export type TScriptsScriptjsResponse = Record<string, any>;
export type TTestDataResponse = {
  field1: null | number;
  field2: P.ITestResponse;
};
