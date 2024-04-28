/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import {
  IEvents, IMessage, MessageTypeKeys, INetsResponse,
} from '../../server/types/types';
import { IClientAppThis } from '../types';
import { AppStatus } from '../constants';
import { EventsStore } from './events.store.class';


type IApp = IClientAppThis & {
  onNewEvents: (events: IEvents) => void;
};

export class Events {
  private lastDate?: string;
  private events: IEvents = [];
  private netEventsMap = new Map<number, EventsStore>;

  constructor(private app: IApp) {
    this.app.on('allnets', this.onAllNets.bind(this));
    this.netEventsMap.set(0, new EventsStore(0, null));
  }

  private onAllNets(nets: INetsResponse) {
    for (const net of nets) {
      const { net_id, parent_net_id } = net;
      if (this.netEventsMap.has(net_id)) continue;
      let parent = this.netEventsMap.get(0);
      if (parent_net_id !== null) {
        parent = this.netEventsMap.get(parent_net_id);
        if (!parent) throw new Error('Parent net is not found');
      }
      const eventsStore = new EventsStore(net_id, parent!);
      this.netEventsMap.set(net_id, eventsStore);
      const events = this.events.filter(
        (event) => event.net_view && event.net_id === net_id);
      eventsStore.addEvents(events);
    }
  }

  private setNewEvents(newEvents: IEvents) {
    this.events = [...this.events, ...newEvents];
    for (const event of newEvents) {
      const { net_id, net_view} = event;
      let eventsStore = this.netEventsMap.get(0);
      if (net_view && net_id) {
        eventsStore = this.netEventsMap.get(net_id);
      }
      if (!eventsStore) throw new Error('eventStore is not found');
      eventsStore.addEvents([event]);
    };
    this.setLastDate(newEvents);
    this.app.onNewEvents(newEvents);
  }

  getEvents() {
    return this.netEventsMap;
  }

  setLastDate(events: IEvents) {
    for (const lastEvent of events) {
      if (!lastEvent.date) continue;
      this.lastDate = lastEvent.date;
    }
  }

  isEventMessage(
    messageData: IMessage<MessageTypeKeys>,
  ): messageData is IMessage<'EVENT' | 'NEW_EVENTS'> {
    return this.isEvent(messageData) || this.isNewEvents(messageData);
  }

  private isEvent(
    messageData: IMessage<MessageTypeKeys>,
  ): messageData is IMessage<'EVENT'> {
    return messageData?.type === 'EVENT';
  }

  private isNewEvents(
    messageData: IMessage<MessageTypeKeys>,
  ): messageData is IMessage<'NEW_EVENTS'> {
    return messageData?.type === 'NEW_EVENTS';
  }

  newEventMessage(messageData: IMessage<'EVENT' | 'NEW_EVENTS'>) {
    const { type } = messageData;
    if (type === 'NEW_EVENTS') this.read();
    else this.add(messageData);
  }

  async read(inChain = false) {
    try {
      !inChain && await this.app.setStatus(AppStatus.LOADING);
      const newEvents = await this.app.api
        .events.read({ date: this.lastDate });
      if (newEvents.length) this.setNewEvents(newEvents);
      !inChain && this.app.setStatus(AppStatus.READY);
    } catch (e: any) {
      if (inChain) throw e;
      this.app.setError(e);
    }
  }

  private async add(event: IMessage<'EVENT'>) {
    this.setNewEvents([event]);
  }

  async confirm(event_id: number) {
    try {
      if (!event_id) return;
      await this.app.setStatus(AppStatus.LOADING);
      await this.app
        .api.events.confirm({ event_id });
      this.app.setStatus(AppStatus.READY);
    } catch (e: any) {
      this.app.setError(e);
    } finally {
      this.remove(event_id);
    }
  }

  remove(eventId: number) {
    const event = this.events.find((v) => eventId === v.event_id);
    if (!event) return;
    const { net_id, net_view } = event;
    let eventsStore = this.netEventsMap.get(0)
    if (net_id && net_view) {
      eventsStore = this.netEventsMap.get(net_id);
      if (!eventsStore) throw new Error('eventStore is not found');
      eventsStore.removeEvent(eventId);
    }
    const events = this.events.filter((v) => event !== v);
    this.events = events;
    this.app.emit('events', this.netEventsMap);
  }

  drop(event: IEvents[number]) {
    this.events = this.events.filter((i) => i !== event);
  }
}
