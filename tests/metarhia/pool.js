const { Queue } = require('./queue');

class Pool {
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

  async use(capture) {
    let item;
    const ready = this.#items.size;
    if (ready) item = this.#items.get();
    else item = await this.#inQueue();
    let i = item;
    const release = () => {
      if (i) this.#addAvailable(i);
      else i = null;
    };
    if (!capture) release();
    return { item, release };
  }

  has(item) {
    return this.#pool.has(item);
  }

  isFree(item) {
    return this.#items.has(item);
  }

  #addAvailable(item) {
    this.#items.add(item);
    this.#popQueue();
  }

  async #inQueue() {
    return new Promise((rv, rj) => {
      let timer = null;
      const out = () => {
        clearTimeout(timer);
        const item = this.#items.get();
        rv(item);
      };
      const timeout = () => {
        this.#queue.drop(out);
        rj(new Error('Pool: next item timeout'));
      };
      this.#queue.add({ out });
      timer = setTimeout(timeout, this.#timeout);
    });
  }

  #popQueue() {
    if (!this.#queue.size) return;
    this.#queue.get().out();
  }
}

module.exports = { Pool };
