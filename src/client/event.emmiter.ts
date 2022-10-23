export default class EventEmmiter {
  private events: Record<string, ((args: any) => void)[]> = {};

  on(event: string, cb: (args: any) => void) {
    this.events[event]?.push(cb) || (this.events[event] = [cb]);
  }

  emit(event: string, data: any) {
    const handlers = this.events[event] || [];
    handlers.forEach((handler) => handler(data));
  }

  remove(event: string, cb: (args: any) => void) {
    const handlers = this.events[event];
    if (!handlers) return;
    this.events[event] = handlers.filter((handler) => handler === cb);
  }
}
