export class EventEmitter {
  private events: Record<string, ((data: any) => void)[]> = {};

  on(event: string, cb: (data: any) => void) {
    const events = this.events[event];
    events ? events.push(cb) : (this.events[event] = [cb]);
  }

  once(event: string, cb: (data: any) => void) {
    const onceCb: typeof cb = (data) => {
      this.remove(event, onceCb);
      cb(data);
    };
    this.on(event, onceCb);
  }

  emit(event: string, data: any) {
    const handlers = this.events[event] || [];
    handlers.forEach((handler) => handler(data));
  }

  remove(event: string, cb: (data: any) => void) {
    const handlers = this.events[event];
    if (!handlers) return;
    this.events[event] = handlers.filter((handler) => handler !== cb);
  }
}
