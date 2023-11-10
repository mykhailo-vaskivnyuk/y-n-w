import * as netBase from './net/net';
import * as netArrange from './net/net.arrange';
import * as netEvent from './event/event';
import * as eventMessages from './event/event.messages';
import * as member from './member/member';
import * as nodesUtils from './utils/nodes.utils';
import * as comUtils from './utils/utils';

export const net = { ...netBase, ...netArrange };
export const event = { ...netEvent, ...eventMessages };
export const utils = { ...nodesUtils, ...comUtils };

export interface IDomain {
  member: typeof member;
  net: typeof net;
  event: typeof event;
  utils: typeof utils;
}
