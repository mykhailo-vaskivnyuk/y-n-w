import * as netBase from './net/net';
import * as netArrange from './net/net.arrange';
import * as netEvent from './event/event';
import * as memberImport from './member/member';
import * as comUtils from './utils/utils';

export const net = { ...netBase, ...netArrange };
export const event = { ...netEvent };
export const member = { ...memberImport };
export const utils = { ...comUtils };

export type IDomain = {
  net: typeof net;
  event: typeof event;
  member: typeof member;
  utils: typeof utils;
};
