/* eslint-disable import/no-cycle */
import * as T from '../../server/types/types';
import { INetEvents } from '../types';
import { Store } from '../lib/store';

export class EventStore extends Store<INetEvents> {
  private childMap = new Map<number, EventStore>();
  private childCountMap = new Map<number, number>();

  constructor(netId: number) {
    super({
      childEventsCount: 0,
      events: [],
      netId,
    });
  }

  setChild(child: EventStore) {
    const { netId } = child.state;
    this.childMap.set(netId, child);
    child.on('state', this.onChildChanged.bind(this));
  }

  getCount() {
    return this.state.events.length;
  }

  getChildCount() {
    return this.state.childEventsCount;
  }

  getAllCount() {
    return this.getCount() + this.getChildCount();
  }

  addEvents(newEvents: T.IEvents) {
    const { events: curEvents } = this.state;
    const events = [...curEvents, ...newEvents];
    this.setState({ events });
  }

  removeEvent(event: T.IEvent) {
    const events = this.state.events.filter((v) => event !== v);
    this.setState({ events });
  }

  onChildChanged(childState: INetEvents) {
    const { netId } = childState;
    const child = this.childMap.get(netId)!;
    let prevChildCount = this.childCountMap.get(netId);
    if (prevChildCount === undefined) {
      prevChildCount = 0;
      this.childCountMap.set(netId, prevChildCount);
    }
    this.childCountMap.set(netId, child.getAllCount());

    const diff = child.getAllCount() - prevChildCount;
    const childEventsCount = this.getChildCount() + diff;
    this.setState({ childEventsCount });
  }
}
