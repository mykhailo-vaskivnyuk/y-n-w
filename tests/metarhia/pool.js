// 'use strict';
const { Queue } = require('./queue');

class Pool {
  constructor(options) {
    this.pool = new Set();
    this.items = new Queue();
    this.queue = new Queue();
    this.timeout = options?.timeout || 0;
  }

  add(item) {
    if (this.pool.has(item)) {
      throw new Error('Pool: add duplicates');
    }
    this.pool.add(item);
    this.#addAvailable(item);
  }

  // capture() {
  //   if (!this.pool.size) return null; // ?
  //   return this.#get(true);
  // }

  // async next() {
  //   if (!this.pool.size) return null; // ?
  //   return (await this.#get(false)).item;
  // }

  async get(capture) {
    let item;
    if (this.queue.size || !this.items.size) {
      item = await this.#reqForItem();
    } else item = this.items.get();
    let i = item;
    const release = () => {
      this.#addAvailable(i);
      i = null;
    };
    if (!capture) release();
    return { item, release };
  }

  #addAvailable(item) {
    if (!item) return;
    this.items.add(item);
    this.#popQueue();
  }

  async #reqForItem() {
    return new Promise((resolve, reject) => {
      const req = { resolve };
      const onTimeout = () => {
        this.queue.remove(req);
        reject(new Error('Pool: next item timeout'));
      };
      req.timer = setTimeout(onTimeout, this.timeout);
      this.queue.add(req);
    });
  }

  #popQueue() {
    if (!this.queue.size) return;
    const req = this.queue.get();
    const item = this.items.get();
    clearTimeout(req.timer);
    req.resolve(item);
  }
}

module.exports = { Pool };
