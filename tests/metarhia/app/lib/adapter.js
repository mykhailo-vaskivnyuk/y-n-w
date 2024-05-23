const { EventEmitter } = require('./event.emitter');

exports.Adapter = class Adapter extends EventEmitter {
  constructor(bus) {
    super();
    this.bus = bus;
  }
};
