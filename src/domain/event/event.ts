import {
  NetEventKeys,
} from '../../client/common/server/types/types';
import { ITransaction } from '../../db/types/types';
import { IMember } from '../types/member.types';
import { EventMessages } from './event.messages';

export class NetEvent {
  private notifService = notificationService;
  private children: NetEvent[] = [];
  public net_id: number | null;
  public event_type: NetEventKeys;
  public member: IMember | null;
  public messages: EventMessages;

  constructor(
    net_id: number | null,
    event_type: NetEventKeys,
    member: IMember | null = null,
  ) {
    this.net_id = net_id;
    this.event_type = event_type;
    this.member = member;
    this.messages = new EventMessages(this);
  }

  createChild(event_type: NetEventKeys, member: IMember | null = null) {
    const event = new NetEvent(this.net_id, event_type, member);
    this.children.push(event);
    return event;
  }

  async commit(t?: ITransaction) {
    for (const child of this.children) {
      await child.commit(t);
    }
    // console.log('COMMIT', {
    //   records: this.messages.records,
    //   instant: this.messages.instantRecords,
    // });
    for (const record of this.messages.records) {
      const params = [
        this.net_id,
        record.net_view,
        record.from_node_id,
        this.event_type,
        record.message,
      ] as const;
      const { user_id, from_node_id } = record;
      if (user_id) {
        await (t?.execQuery || execQuery).events.create([user_id, ...params]);
      } else {
        if (!this.net_id) return; // throw error
        const users = await (t?.execQuery || execQuery)
          .net.users.toSendNewEvents(
            [this.net_id, from_node_id, this.event_type],
          );
        for (const { user_id } of users) {
          await (t?.execQuery || execQuery).events.create([user_id, ...params]);
        }
      }
    }
  }

  send() {
    for (const child of this.children) child.send();

    /* send events */
    for (const record of this.messages.instantRecords) {
      this.notifService.sendEvent({
        net_id: this.net_id,
        event_type: this.event_type,
        ...record,
      });
    }

    /* send events or notifications */
    for (const record of this.messages.records) {
      const { user_id, from_node_id } = record;
      if (user_id) { // for user
        this.notifService.sendEventOrNotif(user_id);
      } else if (this.net_id) { // for users in net
        this.notifService.sendNetEventOrNotif(this.net_id, from_node_id);
      } else {
        logger.warn('Unknown event record', record);
      }
    }
  }
}
