/* eslint-disable max-lines */
import { format } from 'node:util';
import { IEventRecord, INetResponse,
} from '../../client/common/server/types/types';
import { IMember } from '../../db/types/member.types';
import { INetEventTo } from '../../api/types/net.types';
import { NetEvent } from './event';
import {
  INSTANT_EVENTS, NET_MESSAGES_MAP, SET_USER_NODE_ID_FOR,
} from '../../constants/constants';

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

  async create() {
    if (!this.member) return;
    await this.createInCircle();
    await this.createInTree();
    await this.createMessageToMember();
    this.createInstantMessageInNet();
  }

  private async getNet() {
    if (this.net) return this.net;
    const { net_id } = this.event;
    if (!net_id) return null;
    const [net] = await execQuery.net.get([net_id]);
    this.net = net || null;
    return this.net;
  }

  async createInCircle() {
    const {
      node_id: member_node_id,
      parent_node_id,
      confirmed: member_confirmed,
    } = this.member!;
    if (!parent_node_id) return;
    const toFacilitator = this.eventToMessages.FACILITATOR;
    const toCircleMember = this.eventToMessages.CIRCLE;
    if (!toFacilitator && !toCircleMember) return;
    const users = await execQuery.net.circle
      .getMembers([member_node_id, parent_node_id]);
    for (const user of users) {
      const { node_id: user_node_id, confirmed: user_confirmed } = user;
      if (user_node_id === parent_node_id) {
        this.createMessageToFacilitator(user);
      } else if (!member_confirmed) continue;
      else if (!user_confirmed) continue;
      else {
        this.cretaeMessagesToCircleMember(user);
      }
    }
  }

  createMessageToFacilitator(user: IMember) {
    const message = this.eventToMessages.FACILITATOR;
    if (!message) return [];
    const { user_id } = user;
    const { node_id: from_node_id } = this.member!;
    this.records.push({ user_id, net_view: 'tree', from_node_id, message });
  }

  cretaeMessagesToCircleMember(user: IMember) {
    const { event_type } = this.event;
    const message = this.eventToMessages.CIRCLE;
    if (!message) return;
    const { user_id } = user;
    const { node_id: from_node_id } = this.member!;
    const record: IEventRecord = {
      user_id,
      net_view: 'circle',
      from_node_id,
      message,
    };
    if (INSTANT_EVENTS.includes(event_type)) {
      this.instantRecords.push(record);
    } else {
      this.records.push(record);
    }
  }

  async createInTree() {
    const message = this.eventToMessages.TREE;
    if (!message) return;
    const { node_id: from_node_id, confirmed } = this.member!;
    if (!confirmed) return;
    const members = await execQuery.net.tree.getMembers([from_node_id]);
    for (const { user_id } of members) {
      this.records.push({ user_id, net_view: 'circle', from_node_id, message });
    }
  }

  async createMessageToMember() {
    const { event_type } = this.event;
    let message = this.eventToMessages.MEMBER;
    if (!message) return;
    const { user_id, node_id, net_id } = this.member!;
    const [net] = await execQuery.net.data.get([net_id]);
    const { name } = net!;
    const user_node_id =
      SET_USER_NODE_ID_FOR.includes(event_type) ? node_id : null;
    if (!user_node_id) message = format(message, name);
    this.records.push({
      user_id,
      net_view: 'net',
      from_node_id: null,
      message,
    });
  }

  async createInstantMessageInNet() {
    const { event_type, member } = this.event;
    if (!INSTANT_EVENTS.includes(event_type)) return;
    const message = this.eventToMessages.NET;
    if (message === undefined) return;
    this.instantRecords.push({
      user_id: 0,
      net_view: 'net',
      from_node_id: member && member.node_id,
      message,
    });
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

/**
 * voteNetUser
 * removeMemberFromNetAndSubnets
 * api.net.board.save
 * api.net.board.remove
 * api.net.board.clear
 * api.member.data.vote.set
 * api.member.data.vote.unset
 * tighten
 */

/*
createMessagesInTree
  execQuery.events.create
  commitEvents(user_id, date)
createMessagesInCircle
  createMessageToFacilitator
  cretaeMessagesToCircleMember
    sendInstantMessage
    execQuery.events.create
    commitEvents(user_id, date)
    execQuery.events.create
    commitEvents(user_id, date)
createMessageToMember
  execQuery.events.create
  commitEvents(user_id, date)
createInstantMessageInNet
  sendInstantMessageInNet
*/
