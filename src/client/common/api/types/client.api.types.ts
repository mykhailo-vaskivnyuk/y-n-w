export type TMemberInviteCreateResponse = string | null;
export type TMemberInviteCancel = {
  node_id: number;
};
export type TNetConnectByTokenResponse = null | {
  net_id: number;
  error?: string;
};
export type TScriptsScriptjsResponse = Record<string, any>;
