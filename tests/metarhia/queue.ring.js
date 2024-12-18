class QueueRing {
  #pointer = 0;
  #items = [];
  #size = 0;

  add(item) {
    this.#items.splice(this.#pointer, 0, item);
    this.#size++;
  }

  get() {
    const item = this.#items[this.pointer];
    this.#pointer = (this.#pointer + 1) % this.#size;
    return item;
  }
}

module.exports = { QueueRing };
