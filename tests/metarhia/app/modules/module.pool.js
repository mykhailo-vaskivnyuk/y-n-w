const { Adapter } = require('../lib/adapter');
const { Pool } = require('../lib/pool/pool');

exports.ModulePool = class ModulePool extends Adapter {
  #pool;
  #queueRequest;

  constructor(bus) {
    super(bus);
    this.#pool = new Pool({ timeout: 3000 });
    this.bus.on('worker', (worker) => {
      this.#pool.add(worker);
    });
    this.bus.on('queueRequest', (queue) => {
      this.#queueRequest = queue;
      this.#readQueueRequest();
    });
    this.bus.on('prepare', () => {
      this.emit('prepared', this);
    });
  }

  async #readQueueRequest() {
    for await (const data of this.#queueRequest) {
      const { item, release } = await this.#pool.use(true);
      item.on('done', release);
      item.emit('task', data);
    }
  }
};
