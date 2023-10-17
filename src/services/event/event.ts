import {
  IEventRecord, NetEventKeys,
} from '../../client/common/server/types/types';
import { ITransaction } from '../../db/types/types';

export class NetEvent {
  private records: IEventRecord[] = [];
  private children: NetEvent[] = [];
  public net_id: number | null = null;
  public event_type: NetEventKeys;
  public date;

  constructor(
    net_id: number | null,
    event_type: NetEventKeys,
    date?: string,
  ) {
    this.net_id = net_id;
    this.event_type = event_type;
    this.date = date || new Date().toUTCString();
  }

  addEvent(record: Omit<IEventRecord, 'net_id'>) {
    this.records.push({ ...record, net_id: this.net_id });
  }

  addOutNetEvent(
    record: Omit<IEventRecord, 'net_id' | 'from_node_id' | 'net_view'>
  ) {
    this.records.push({
      ...record, net_id: null, net_view: null, from_node_id: null,
    });
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
    for (const record of this.records) {
      const params = [
        record.user_id,
        this.net_id,
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
