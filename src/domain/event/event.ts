import {
  NetEventKeys,
} from '../../client/common/server/types/types';
import { IMember } from '../../db/types/member.types';
import { ITransaction } from '../../db/types/types';
import { NotificationService } from '../../services/notification/notification';
import { EventMessages } from './event.messages';

export class NetEvent {
  private children: NetEvent[] = [];
  public net_id: number | null;
  public event_type: NetEventKeys;
  public member: IMember | null;
  public date: string;
  public messages: EventMessages;

  constructor(
    net_id: number | null,
    event_type: NetEventKeys,
    member: IMember | null = null,
    date?: string,
  ) {
    this.net_id = net_id;
    this.event_type = event_type;
    this.member = member;
    this.date = date || new Date().toUTCString();
    this.messages = new EventMessages(this);
  }

  createChild(event_type: NetEventKeys, member: IMember | null = null) {
    const event = new NetEvent(this.net_id, event_type, member, this.date);
    this.children.push(event);
    return event;
  }

  async commit(notificationService: NotificationService, t?: ITransaction) {
    for (const child of this.children) {
      await child.commit(notificationService, t);
    }
    for (const record of this.messages.instantRecords) {
      notificationService.addEvent({
        net_id: this.net_id,
        event_type: this.event_type,
        ...record,
      });
    }
    for (const record of this.messages.records) {
      const params = [
        record.user_id,
        record.net_id === null ? null : this.net_id,
        record.net_view,
        record.from_node_id,
        this.event_type,
        record.message,
        this.date,
      ] as const;
      await (t?.execQuery || execQuery).events.create([...params]);
      notificationService.addNotification(record.user_id, this.date);
    }
  }
}
