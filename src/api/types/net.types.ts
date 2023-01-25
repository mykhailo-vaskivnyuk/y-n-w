export const NET_EVENT_MAP = {
  LEAVE: 'leave',
};
export type NetEventKeys = keyof typeof NET_EVENT_MAP;

export const NET_EVENT_FROM_MAP = {
  TREE: 'tree',
  INVITED: 'invited',
  CIRCLE: 'circle',
  FACILITATOR: 'facilitator',
};
export type NetEventFromKeys = keyof typeof NET_EVENT_FROM_MAP;
