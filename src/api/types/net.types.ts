export const NET_EVENT_TO_MAP = {
  TREE: 'tree',
  CONNECTED: 'connected',
  CIRCLE: 'circle',
  FACILITATOR: 'facilitator',
  MEMBER: 'member',
  NET: 'net',
};
export type NetEventToKeys = keyof typeof NET_EVENT_TO_MAP;

export interface INetEventTo {
  TREE?: string;
  CIRCLE?: string;
  CONNECTED?: string;
  FACILITATOR?: string;
  MEMBER?: string;
  NET?: string;
}
