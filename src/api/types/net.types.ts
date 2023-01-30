export const NET_EVENT_MAP = {
  LEAVE: 'leave',
  LEAVE_CONNECTED: 'leave_connected',
  REFUSE: 'refuse',
  DISLIKE: 'dislike',
  VOTE: 'vote',
  LEAVE_VOTE: 'leave_vote',
  LEAVE_DISVOTE: 'leave_disvote',
  CONNECT_VOTE: 'connect_vote',
  CONNECT_DISVOTE: 'connect_disvote',
  UNACTIVE_DISCONNECT: 'unactive_disconnect',
  NOT_VOTE_DISCONNECT: 'not_vote_disconnect',
};
export type NetEventKeys = keyof typeof NET_EVENT_MAP;

export const NET_EVENT_TO_MAP = {
  TREE: 'tree',
  CONNECTED: 'connected',
  CIRCLE: 'circle',
  FACILITATOR: 'facilitator',
  MEMBER: 'member',
};
export type NetEventToKeys = keyof typeof NET_EVENT_TO_MAP;
