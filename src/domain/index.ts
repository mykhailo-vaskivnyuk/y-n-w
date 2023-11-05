import * as netBase from './net/net';
import * as netArrange from './net/net.arrange';
import * as netEvent from './event/event';
import * as eventMessages from './event/event.messages';
import { NetEvent } from './event/event';
import { EventMessages } from './event/event.messages';
import {
  createNet, removeMemberFromNet, removeMemberFromAllNets,
} from './net/net';
import { NetArrange } from './net/net.arrange';
import { Member } from './member/member';

export const net = { net: netBase, ...netArrange };
export const event = { ...netEvent, ...eventMessages };

export interface IDomain {
  member: {
    Member: typeof Member;
  }
  net: {
    createNet: typeof createNet;
    removeMemberFromNet: typeof removeMemberFromNet;
    removeMemberFromAllNets: typeof removeMemberFromAllNets;
    NetArrange: typeof NetArrange;
  };
  event: {
    NetEvent: typeof NetEvent;
    EventMessages: typeof EventMessages;
  };
}
