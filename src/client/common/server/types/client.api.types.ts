import * as P from './types';

export type TAccountOvertg = {
  initData: string;
};
export type TAccountSignupTg = {
  initData: string;
};
export type TAccountMessengerLinkGetResponse = string | null;
export type TAdminNetGetResponse = {
};
export type TEventsRead = {
  event_id?: number;
};
export type TEventsConfirm = {
  event_id: number;
};
export type TMemberDisconnectNotVote = {
  monthAgo: number;
};
export type TMemberDisconnectUnactive = {
  monthAgo: number;
};
export type TMemberDataVoteSetResponse = boolean | null;
export type TMemberInviteCreateResponse = string | null;
export type TNetBoardClear = {
  weekAgo: number;
};
export type TScriptsScriptjsResponse = Record<string, any>;
export type TTestDataResponse = {
  field1: null | number;
  field2: P.ITestResponse;
};
