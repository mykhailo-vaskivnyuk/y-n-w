export const NET_EVENT_MAP = {
  LEAVE: 'leave',
  LEAVE_CONNECTED: 'leave_connected',
  REFUSE: 'refuse',
  DISLIKE: 'dislike',
  LEAVE_VOTE: 'leave_vote',
  LEAVE_DISVOTE: 'leave_disvote',
  CONNECT_VOTE: 'connect_vote',
  CONNECT_DISVOTE: 'connect_disvote',
};
export type NetEventKeys = keyof typeof NET_EVENT_MAP;

export const NET_EVENT_TO_MAP = {
  TREE: 'tree',
  CONNECTED: 'connected',
  CIRCLE: 'circle',
  FACILITATOR: 'facilitator',
};
export type NetEventToKeys = keyof typeof NET_EVENT_TO_MAP;
