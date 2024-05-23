const { Adapter } = require('../lib/adapter');
const { Worker } = require('../lib/worker');

exports.ModuleWorker = class ModuleWorker extends Adapter {
  #worker;
  #queueResponse;
  #transport;

  constructor(bus, name) {
    super(bus);
    this.name = name;
    this.#worker = new Worker();
    this.bus.on('queueResponse', (queue) => {
      this.#queueResponse = queue;
    });
    this.bus.on('transport', (transport) => {
      this.#transport = transport;
    });
    this.bus.on('prepare', () => {
      this.#prepare();
    });
  }

  #prepare() {
    this.on('task', (data) => {
      this.#calculate(data);
    });
    this.bus.emit('worker', this);
    this.emit('prepared', this);
  }

  async #calculate(data) {
    console.log(this.name);
    const result = await this.#worker.calculate(data);
    if (this.#queueResponse) this.#queueResponse.push(result);
    else await this.#transport.send(result);
    this.emit('done');
  }
};
