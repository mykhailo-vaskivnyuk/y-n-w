import * as netBase from './net/net';
import * as netArrange from './net/net.arrange';
import * as netEvent from './event/event';
import * as eventMessages from './event/event.messages';

export const net = { net: netBase, ...netArrange };
export const event = { ...netEvent, ...eventMessages };
