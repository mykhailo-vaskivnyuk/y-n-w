class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
    this._size = 0;
  }

  add(item) {
    const last = this.tail;
    this.tail = { item, next: null };
    if (!last) this.head = this.tail;
    else last.next = this.tail;
    this._size++;
  }

  get() {
    if (!this.head) return null;
    const { item, next } = this.head;
    this.head = next;
    if (!this.head) this.tail = null;
    this._size--;
    return item;
  }

  drop(item) {
    let cur = this.head;
    let prev = null;
    while (cur) {
      if (cur.item === item) break;
      cur = cur.next;
      prev = cur;
    }
    if (!cur) return null;
    if (prev) prev.next = cur.next;
    else this.head = cur.next;
    if (!cur.next) this.tail = this.head;
    this._size--;
    return item;
  }

  has(item) {
    let cur = this.head;
    while (cur) {
      if (cur.item === item) return true;
      cur = cur.next;
    }
    return false;
  }

  get size() {
    return this._size;
  }
}

module.exports = { Queue };
