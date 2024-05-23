const { Adapter } = require('../lib/adapter');

exports.ModuleController = class ModuleController extends Adapter {
  #transport;
  #counter = 100;
  #startTime = 0;

  constructor(bus) {
    super(bus);
    this.bus.on('transport', (transport) => {
      this.#transport = transport;
      transport.on('request', () => {
        if (this.#startTime) return;
        this.#startTime = Date.now();
      });
      transport.on('response', (response) => {
        console.log('controller', response);
        this.#counter--;
        if (this.#counter) return;
        const duration = (Date.now() - this.#startTime) / 1000;
        console.log('Duration: %ss', duration.toFixed(1));
      });
    });
    this.bus.on('prepare', () => {
      this.emit('prepared', this);
    });
  }
};
