/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import * as T from '../../server/types/types';
import { IClientAppThis } from '../types';
import { AppStatus } from '../constants';
import { EventStore } from './event.store.class';

type IApp = IClientAppThis & {
  onNewEvents: (events: T.IEvents) => void;
};

export class Events {
  private lastEvent: T.IEvent;
  private events: T.IEvents = [];
  private netEventsMap = new Map<number, EventStore>();

  constructor(private app: IApp) {
    this.app.on('allnets', this.onAllNets.bind(this));
    this.netEventsMap.set(0, new EventStore(0));
  }

  private onAllNets(nets: T.INetsResponse) {
    for (const net of nets) {
      const { net_id, parent_net_id } = net;
      if (this.netEventsMap.has(net_id)) continue;
      let parent = this.netEventsMap.get(0);
      if (parent_net_id !== null) {
        parent = this.netEventsMap.get(parent_net_id);
        if (!parent) throw new Error('Parent net is not found');
      }
      const eventStore = new EventStore(net_id);
      this.netEventsMap.set(net_id, eventStore);
      parent!.setChild(eventStore);
      const events = this.events.filter((event) => event.net_view && event.net_id === net_id);
      eventStore.addEvents(events);
    }
  }

  private setNewEvents(newEvents: T.IEvents) {
    this.events = [...this.events, ...newEvents];
    for (const event of newEvents) {
      const { net_id, net_view } = event;
      let eventStore = this.netEventsMap.get(0);
      if (net_view && net_id) {
        eventStore = this.netEventsMap.get(net_id);
      }
      if (!eventStore) throw new Error('eventStore is not found');
      eventStore.addEvents([event]);
    }
    this.setLastEventId(newEvents);
    this.app.onNewEvents(newEvents);
  }

  getEvents() {
    return this.netEventsMap;
  }

  setLastEventId(events: T.IEvents) {
    for (const lastEvent of events) {
      if (!lastEvent.event_id) continue;
      this.lastEvent = lastEvent;
    }
  }

  isEventMessage(
    messageData: T.IMessage<T.MessageTypeKeys>,
  ): messageData is T.IMessage<'EVENT' | 'NEW_EVENTS'> {
    return this.isEvent(messageData) || this.isNewEvents(messageData);
  }

  private isEvent(messageData: T.IMessage<T.MessageTypeKeys>): messageData is T.IMessage<'EVENT'> {
    return messageData?.type === 'EVENT';
  }

  private isNewEvents(
    messageData: T.IMessage<T.MessageTypeKeys>,
  ): messageData is T.IMessage<'NEW_EVENTS'> {
    return messageData?.type === 'NEW_EVENTS';
  }

  newEventMessage(messageData: T.IMessage<'EVENT' | 'NEW_EVENTS'>) {
    const { type } = messageData;
    if (type === 'NEW_EVENTS') this.read();
    else this.add(messageData);
  }

  async read(inChain = false) {
    try {
      !inChain && (await this.app.setStatus(AppStatus.LOADING));
      const { event_id } = this.lastEvent || {};
      const newEvents = await this.app.api.events.read({ event_id });
      if (newEvents.length) this.setNewEvents(newEvents);
      !inChain && this.app.setStatus(AppStatus.READY);
    } catch (e: any) {
      if (inChain) throw e;
      this.app.setError(e);
    }
  }

  private async add(event: T.IMessage<'EVENT'>) {
    this.setNewEvents([event]);
  }

  async confirm(event: T.IEvent) {
    try {
      if (!event.event_id) return;
      await this.app.setStatus(AppStatus.LOADING);
      await this.app.api.events.confirm(event);
      this.app.setStatus(AppStatus.READY);
    } catch (e: any) {
      this.app.setError(e);
    } finally {
      this.remove(event);
    }
  }

  remove(event: T.IEvent) {
    const { net_id, net_view } = event;
    let eventStore = this.netEventsMap.get(0);
    if (net_id && net_view) {
      eventStore = this.netEventsMap.get(net_id);
      if (!eventStore) throw new Error('eventStore is not found');
      eventStore.removeEvent(event);
    }
    const events = this.events.filter((v) => event !== v);
    this.events = events;
    this.app.emit('events', this.netEventsMap);
  }

  drop(event: T.IEvent) {
    this.events = this.events.filter((i) => i !== event);
  }
}
