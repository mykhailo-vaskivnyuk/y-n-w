const { Queue } = require('./queue');

class PoolSimple {
  #pool = new Set();
  #items = new Queue();
  #queue = new Queue();
  #timeout;

  constructor(options = {}) {
    this.#timeout = options.timeout || 0;
  }

  add(item) {
    const hasItem = this.#pool.has(item);
    if (hasItem) throw new Error('Pool: add duplicates');
    this.#pool.add(item);
    this.#addAvailable(item);
  }

  async use() {
    return this.#_get(false);
  }

  async get() {
    return this.#_get(true);
  }

  has(item) {
    return this.#pool.has(item);
  }

  isFree(item) {
    return this.#items.has(item);
  }

  async #_get(exclusive) {
    let item;
    const ready = this.#items.size;
    if (ready) item = this.#items.get();
    else item = await this.#pushQueue();
    if (exclusive) this.#pool.delete(item);
    else this.#addAvailable(item);
    return item;
  }

  #addAvailable(item) {
    this.#items.add(item);
    this.#shiftQueue();
  }

  #shiftQueue() {
    if (!this.#queue.size) return;
    this.#queue.get().out();
  }

  async #pushQueue() {
    return new Promise((rv, rj) => {
      let timeout = null;

      const out = () => {
        clearTimeout(timeout);
        const item = this.#items.get();
        rv(item);
      };

      const onTimeout = () => {
        this.#queue.drop(out);
        rj(new Error('Pool: next item timeout'));
      };

      this.#queue.add({ out });
      timeout = setTimeout(onTimeout, this.#timeout);
    });
  }
}

module.exports = { PoolSimple };
