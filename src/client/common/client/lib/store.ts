import { EventEmitter } from './event.emitter';

export class Store<T extends object> extends EventEmitter {
  public state: T;

  constructor(initialState: T) {
    super();
    this.state = { ...initialState };
  }

  setState(newState: Partial<T>) {
    this.state = Object.assign(this.state, newState);
    this.emit('state', this.state);
  }
}
