/*
*  type Element = { item: any, w: number }
*  type Queue = Array<Element>
*  <used> Element["w"] > 0
*  <unused> Element["w"] === 0
*  <sorted> Element[i] <= Element[i + 1]
*/

const HEAD = 0;
const sortByWeight = (i1, i2) => i1.w - i2.w;

class PoolQueue {
  #q = [];

  add(item) {
    this.#q.push({ item, w: 0 });
  }

  get() {
    if (!this.hasUnused()) {
      throw new Error('Queue does not have unused items');
    }
    return this.#q.shift().item;
  }

  use() {
    const elem = this.#q[HEAD];
    if (!elem) throw new Error('Queue is empty');
    elem.w++;
    this.sort();
    return elem.item;
  }

  release(item) {
    const i = this.#q.findIndex(({ item: i }) => i === item);
    if (i === -1) return;
    this.#q[i].w--;
    this.sort();
  }

  sort() {
    this.#q.sort(sortByWeight);
  }

  size() {
    return this.#q.length;
  }

  hasUnused() {
    if (!this.size) return false;
    const { w } = this.#q[HEAD];
    return w === 0;
  }
}

module.exports = { PoolQueue };
