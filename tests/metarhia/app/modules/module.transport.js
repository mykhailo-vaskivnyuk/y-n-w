const { Adapter } = require('../lib/adapter');
const { Transport } = require('../lib/transport');

exports.ModuleTransport = class ModuleTransport extends Adapter {
  #transport;
  #queueRequest;
  #queueResponse;

  constructor(bus) {
    super(bus);
    this.#transport = new Transport();
    this.bus.on('queueRequest', (queue) => {
      this.#queueRequest = queue;
    });
    this.bus.on('queueResponse', (queue) => {
      this.#queueResponse = queue;
      this.#sendFromQueue();
    });
    this.bus.on('prepare', () => {
      this.#prepare();
    });
    this.bus.on('start', () => {
      this.#transport.listen();
    });
  }

  #prepare() {
    this.#listen();
    this.bus.emit('transport', this);
    this.emit('prepared', this);
  }

  #listen() {
    const handler = (request) => {
      this.#queueRequest.push(request);
      this.emit('request', request);
    };
    this.#transport.onRequest(handler);
  }

  async #sendFromQueue() {
    if (!this.#queueResponse) return;
    for await (const response of this.#queueResponse) {
      await this.send(response);
    }
  }

  async send(response) {
    await this.#transport.send(response);
    this.emit('response', response);
  }
};
