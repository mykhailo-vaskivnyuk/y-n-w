export const NET_EVENT_MAP = {
  LEAVE: 'leave',
  LEAVE_CONNECTED: 'leave_connected',
  REFUSE: 'refuse',
  VOTE: 'vote',
  DISLIKE: 'dislike',
};
export type NetEventKeys = keyof typeof NET_EVENT_MAP;

export const NET_EVENT_TO_MAP = {
  TREE: 'tree',
  CONNECTED: 'connected',
  CIRCLE: 'circle',
  FACILITATOR: 'facilitator',
};
export type NetEventToKeys = keyof typeof NET_EVENT_TO_MAP;
