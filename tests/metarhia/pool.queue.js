const HEAD = 0;

class Queue {
  #q = [];

  push(item) {
    this.#q.push({ item, w: 0 });
  }

  shift() {
    return this.#q.shift().item;
  }

  use() {
    const elem = this.#q[HEAD];
    elem.w++;
    this.sort();
  }

  unuse(item) {
    const i = this.#q.findIndex(({ item: i }) => i === item);
    this.#q[i].w--;
    this.sort();
  }

  sort() {
    this.#q.sort(({ w: a }, { w: b }) => a - b);
  }

  size() {
    return this.#q.length;
  }

  isFree() {
    if (!this.size) return false;
    const { w } = this.#q[HEAD];
    return w === 0;
  }
}

module.exports = { Queue };
