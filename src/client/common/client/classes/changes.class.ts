/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import {
  IEvents, IMessage, MessageTypeKeys,
} from '../../server/types/types';
import { IClientAppThis } from '../types';
import { AppStatus } from '../constants';


type IApp = Pick<IClientAppThis,
  | 'api'
  | 'getState'
  | 'setStatus'
  | 'setError'
  | 'setUser'
  | 'net'
  | 'emit'
>;

export class Changes {
  private lastDate?: string;
  private netChanges: IEvents = [];

  constructor(private app: IApp) {}

  private setChanges(changes: IEvents) {
    this.netChanges = changes;
    this.app.emit('changes', changes);
  }

  getChanges() {
    return this.netChanges;
  }

  setLastDate(changes: IEvents) {
    this.lastDate = changes.at(-1)?.date;
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
    !inChain && this.app.setStatus(AppStatus.LOADING);
    try {
      const newChanges = await this.app.api
        .user.changes.read({ date: this.lastDate });
      this.setLastDate(newChanges);
      !inChain && await this.update(newChanges);
      if (newChanges.length) {
        const { changes: curChanges } = this.app.getState();
        this.setChanges([...curChanges, ...newChanges]);
      }
      !inChain && this.app.setStatus(AppStatus.READY);
    } catch (e: any) {
      if (inChain) throw e;
      this.app.setError(e);
    }
  }

  async update(changes: IEvents) {
    const { user, net } = this.app.getState();
    const { net_id: netId } = net || {};
    let updateAll = false;
    let updateNet = false;
    for (const change of changes) {
      const { net_id: changeNetId, net_view: netView } = change;
      if (netView === 'net') {
        updateAll = true;
        if (changeNetId !== undefined && netId) updateNet = true;
        break;
      }
      if (changeNetId === netId) updateNet = true;
    }
    if (updateAll) await this.app.setUser({ ...user! }, false)
      .catch(console.log);
    if (updateNet) await this.app.net.enter(netId!, true)
      .catch(console.log);
  }

  async confirm(eventId: number) {
    this.app.setStatus(AppStatus.LOADING);
    try {
      await this.app.api.user.changes
        .confirm({ event_id: eventId });
      this.app.setStatus(AppStatus.READY);
    } catch (e: any) {
      this.app.setError(e);
    }
  }

  remove(eventId: number) {
    const changes = this.netChanges
      .filter(({ event_id: v }) => eventId !== v);
    this.setChanges(changes);
  }
}
