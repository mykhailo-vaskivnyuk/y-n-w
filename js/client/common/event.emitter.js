"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventEmitter {
    events = {};
    on(event, cb) {
        const events = this.events[event];
        events ? events.push(cb) : (this.events[event] = [cb]);
    }
    emit(event, data) {
        const handlers = this.events[event] || [];
        handlers.forEach((handler) => handler(data));
    }
    remove(event, cb) {
        const handlers = this.events[event];
        if (!handlers)
            return;
        this.events[event] = handlers.filter((handler) => handler !== cb);
    }
}
exports.default = EventEmitter;
//# sourceMappingURL=event.emitter.js.map