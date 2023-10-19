import {
  NetEventKeys,
} from '../../client/common/server/types/types';
import { ITransaction } from '../../db/types/types';
import { EventMessages } from './event.messages';

export class NetEvent {
  private children: NetEvent[] = [];
  public net_id: number | null = null;
  public event_type: NetEventKeys;
  public date;
  public messages: EventMessages;

  constructor(
    net_id: number | null,
    event_type: NetEventKeys,
    date?: string,
  ) {
    this.net_id = net_id;
    this.event_type = event_type;
    this.date = date || new Date().toUTCString();
    this.messages = new EventMessages(this);
  }

  createChild(event_type: NetEventKeys) {
    const event = new NetEvent(this.net_id, event_type, this.date);
    this.children.push(event);
    return event;
  }

  async write(t?: ITransaction) {
    for (const child of this.children) {
      if (child.children.length) await child.write(t);
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
