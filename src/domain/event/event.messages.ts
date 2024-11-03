/* eslint-disable max-lines */
import { format } from 'node:util';
import { IEventRecord, INetResponse,
} from '../../client/common/server/types/types';
import { ITransaction } from '../../db/types/types';
import { IMember } from '../types/member.types';
import { INetEventTo } from '../../domain/types/net.event.types';
import {
  INSTANT_EVENTS, NET_MESSAGES_MAP, SET_NET_ID_FOR,
} from '../../constants/constants';
import { NetEvent } from './event';

export class EventMessages {
  private event: NetEvent;
  private member: IMember | null;
  private eventToMessages: INetEventTo;
  private net: INetResponse = null;
  public readonly records: IEventRecord[] = [];
  public readonly instantRecords: IEventRecord[] = [];

  constructor(event: NetEvent) {
    const { member, event_type } = event;
    this.event = event;
    this.member = member;
    this.eventToMessages = NET_MESSAGES_MAP[event_type];
  }

  async create(t?: ITransaction) {
    if (this.member) {
      await this.createInCircle(t);
      await this.createInTree(t);
      await this.createMessageToMember();
    }
    this.createInNet();
  }

  removeFromNodes(nodeIds: number[]) {
    let i = -1;
    for (const { from_node_id } of [...this.records]) {
      i++;
      if (!from_node_id) continue;
      if (!nodeIds.includes(from_node_id)) continue;
      this.records.splice(i--, 1);
    }
  }

  private async getNet() {
    if (this.net) return this.net;
    const { net_id } = this.event;
    if (!net_id) return null;
    const [net] = await execQuery.net.get([net_id]);
    this.net = net || null;
    return this.net;
  }

  async createInCircle(t?: ITransaction) {
    const { node_id, parent_node_id } = this.member!;
    if (!parent_node_id) return;
    const toFacilitator = this.eventToMessages.FACILITATOR;
    const toCircleMember = this.eventToMessages.CIRCLE;
    if (!toFacilitator && !toCircleMember) return;
    const members = await (t?.execQuery || execQuery)
      .net.circle.getMembers([node_id, parent_node_id]);
    for (const member of members) {
      const { node_id: member_node_id, confirmed: member_confirmed } = member;
      if (member_node_id === parent_node_id)
        this.createMessageToFacilitator(member);
      else if (!member_confirmed) continue;
      else this.cretaeMessagesToCircleMember(member);
    }
  }

  createMessageToFacilitator(member: IMember) {
    const message = this.eventToMessages.FACILITATOR;
    if (message === undefined) return;
    const { user_id } = member;
    const { node_id: from_node_id } = this.member!;
    const record: IEventRecord = {
      user_id,
      net_view: 'tree',
      from_node_id,
      message,
    };
    const { event_type } = this.event;
    if (INSTANT_EVENTS.includes(event_type))
      this.instantRecords.push(record);
    else this.records.push(record);
  }

  cretaeMessagesToCircleMember(member: IMember) {
    const message = this.eventToMessages.CIRCLE;
    if (message === undefined) return;
    const { user_id } = member;
    const { node_id: from_node_id } = this.member!;
    const record: IEventRecord = {
      user_id,
      net_view: 'circle',
      from_node_id,
      message,
    };
    const { event_type } = this.event;
    if (INSTANT_EVENTS.includes(event_type))
      this.instantRecords.push(record);
    else this.records.push(record);
  }

  async createInTree(t?: ITransaction) {
    const message = this.eventToMessages.TREE;
    if (message === undefined) return;
    const { node_id: from_node_id } = this.member!;
    const members = await (t?.execQuery || execQuery)
      .net.tree.getMembers([from_node_id]);
    for (const { user_id } of members) {
      this.records.push({
        user_id,
        net_view: 'circle',
        from_node_id,
        message,
      });
    }
  }

  async createMessageToMember() {
    const { event_type } = this.event;
    let message = this.eventToMessages.MEMBER;
    if (message === undefined) return;
    const { user_id, net_id } = this.member!;
    const net_view = SET_NET_ID_FOR.includes(event_type) ? 'net' : null;
    if (!net_view) {
      const [net] = await execQuery.net.data.get([net_id]);
      const { name } = net!;
      message = format(message, name);
    }
    this.records.push({
      user_id,
      net_view,
      from_node_id: null,
      message,
    });
  }

  createInNet() {
    const message = this.eventToMessages.NET;
    if (message === undefined) return;
    const { event_type, member } = this.event;
    const record: IEventRecord = {
      user_id: 0,
      net_view: 'net',
      from_node_id: member && member.node_id,
      message,
    };
    if (INSTANT_EVENTS.includes(event_type)) {
      this.instantRecords.push(record);
    } else {
      this.records.push(record);
    }
  }

  async createToConnected(user_id: number) {
    const net = await this.getNet();
    const message = format(this.eventToMessages.CONNECTED, net?.name);
    this.records.push({
      user_id,
      net_id: null,
      net_view: null,
      from_node_id: null,
      message,
    });
  }
}
