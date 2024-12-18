export const MAX_NET_LEVEL = 3;
export const MAX_NODE_LEVEL = 5;

export const MEMBER_STATUS = [
  'UNAVAILABLE',
  'EMPTY',
  'FREE',
  'INVITED',
  'CONNECTED',
  'ACTIVE',
] as const;

export type MemberStatusKeys = (typeof MEMBER_STATUS)[number];

export const PING_INTERVAL = 5000;
