/* eslint-disable import/no-cycle */
import { INetEvents } from "../types";
import { Store } from "../lib/store";
import * as T from '../../server/types/types';

const getInitialState = (netId: number ) => ({
  childEventsCount: 0,
  events: [],
  netId,
});

export class EventsStore extends Store<INetEvents> {
  constructor(netId: number, parent: Store<INetEvents> | null) {
    super(getInitialState(netId), parent);
  }

  addEvents(newEvents: T.IEvents) {
    const { events: curEvents } = this.state;
    const events = [...curEvents, ...newEvents];
    this.setState({ events });
  }

  removeEvent(eventId: number) {
    const event = this.state.events.find((v) => eventId === v.event_id);
    if (!event) return;
    const events = this.state.events.filter((v) => event !== v);
    this.setState({ events });
  }

  onChildChanged(childState: INetEvents) {
    const { childEventsCount: count } = this.state;
    const childEventsCount = count + childState.childEventsCount;
    this.setState({ childEventsCount });
  }
}