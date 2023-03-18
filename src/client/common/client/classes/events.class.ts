/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import {
  IEvents, IMessage, MessageTypeKeys,
} from '../../server/types/types';
import { IClientAppThis } from '../types';
import { AppStatus } from '../constants';


type IApp = IClientAppThis;

export class Events {
  private lastDate?: string;
  private events: IEvents = [];

  constructor(private app: IApp) {}

  private setEvents(events: IEvents) {
    this.events = events;
    this.app.emit('events', events);
  }

  getEvents() {
    return this.events;
  }

  setLastDate(events: IEvents) {
    this.lastDate = events.at(-1)?.date;
  }

  isEvent(
    messageData: IMessage<MessageTypeKeys>,
  ): messageData is IMessage<'EVENT'> {
    return messageData?.type === 'EVENT';
  }

  isNewEvents(
    messageData: IMessage<MessageTypeKeys>,
  ): messageData is IMessage<'NEW_EVENTS'> {
    return messageData?.type === 'NEW_EVENTS';
  }

  async read(inChain = false) {
    !inChain && await this.app.setStatus(AppStatus.LOADING);
    try {
      const newEvents = await this.app.api
        .user.changes.read({ date: this.lastDate });
      this.setLastDate(newEvents);
      !inChain && await this.setEvents(newEvents);
      if (newEvents.length) this.setEvents([...this.events, ...newEvents]);
      !inChain && this.app.setStatus(AppStatus.READY);
    } catch (e: any) {
      if (inChain) throw e;
      this.app.setError(e);
    }
  }

  async confirm(event_id: number) {
    await this.app.setStatus(AppStatus.LOADING);
    try {
      await this.app.api.user.changes
        .confirm({ event_id });
      this.app.setStatus(AppStatus.READY);
    } catch (e: any) {
      this.app.setError(e);
    }
  }

  remove(eventId: number) {
    const events = this.events
      .filter(({ event_id: v }) => eventId !== v);
    this.setEvents(events);
  }
}
