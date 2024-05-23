exports.EventEmitter = class EventEmitter {
  #events = {};

  on(event, cb) {
    const events = this.#events[event];
    events ? events.push(cb) : (this.#events[event] = [cb]);
  }

  once(event, cb) {
    const onceCb = (data) => {
      this.remove(event, onceCb);
      cb(data);
    };
    this.on(event, onceCb);
  }

  emit(event, data) {
    const handlers = this.#events[event] || [];
    handlers.forEach((handler) => handler(data));
  }

  remove(event, cb) {
    const handlers = this.#events[event];
    if (!handlers) return;
    this.#events[event] = handlers.filter((handler) => handler !== cb);
  }
};
