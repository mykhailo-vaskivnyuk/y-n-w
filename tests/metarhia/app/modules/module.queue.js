const { Adapter } = require('../lib/adapter');
const { Readable } = require('node:stream');

exports.ModuleQueue = class ModuleQueue extends Adapter {
  #queue;

  constructor(bus, name) {
    super(bus);
    this.#queue = new Readable({ read: () => true, objectMode: true });
    this.bus.on('prepare', () => {
      this.bus.emit(name, this);
      this.emit('prepared', this);
    });
  }

  [Symbol.asyncIterator]() {
    return this.#queue[Symbol.asyncIterator]();
  }

  push(item) {
    this.#queue.push(item);
  }
};
