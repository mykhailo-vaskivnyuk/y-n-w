import { EventEmitter } from "./event.emitter";

export class Store<T extends object> extends EventEmitter {
  public state: T;
  protected parent: Store<T> | null;

  constructor(initialState: T, parent: Store<T> | null = null) {
    super()
    this.state = { ...initialState };
    this.parent = parent;
    this.init();
  }

  init() {
    this.on('state', () => {
      this.parent?.emit('childstate', this.state);
    });
    this.on('childstate', this.onChildChanged.bind(this));
  }

  setState(newState: Partial<T>) {
    this.state = Object.assign(this.state, newState);
    this.emit('state', this.state);
  }

  onChildChanged(state: T) {
    console.log(state);
    throw new Error('Method is not defined');
  }
}
