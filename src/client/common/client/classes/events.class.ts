/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import {
  IEvents, IMessage, MessageTypeKeys,
} from '../../server/types/types';
import { IClientAppThis } from '../types';
import { AppStatus } from '../constants';


type IApp = IClientAppThis & {
  onNewEvents: () => void;
};

export class Events {
  private lastDate?: string;
  private events: IEvents = [];

  constructor(private app: IApp) {}

  private setEvents(events: IEvents) {
    this.events = events;
    this.setLastDate(events);
    this.app.onNewEvents();
  }

  getEvents() {
    return this.events;
  }

  setLastDate(events: IEvents) {
    const [lastEvent] = events;
    if (!lastEvent.date) return;
    this.lastDate = lastEvent.date;
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
      if (newEvents.length) this.setEvents([...this.events, ...newEvents]);
      !inChain && this.app.setStatus(AppStatus.READY);
    } catch (e: any) {
      if (inChain) throw e;
      this.app.setError(e);
    }
  }

  private async add(event: IMessage<'EVENT'>) {
    this.setEvents([...this.events, event]);
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
    const events = this.events.filter((v) => event !== v);
    this.setEvents(events);
  }

  drop(event: IEvents[number]) {
    this.events = this.events.filter((i) => i !== event);
  }
}
