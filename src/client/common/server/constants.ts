export const MAX_NET_LEVEL = 4;
export const MAX_NODE_LEVEL = 2;

export const MEMBER_STATUS_MAP = {
  UNAVAILABLE: 'unavailable',
  EMPTY: 'empty',
  FREE: 'free',
  INVITED: 'invited',
  CONNECTED: 'connected',
  ACTIVE: 'active',
};

export type MemberStatusKeys = keyof typeof MEMBER_STATUS_MAP;

export const PING_INTERVAL = 5000;
