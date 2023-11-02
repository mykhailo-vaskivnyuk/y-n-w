// 'use strict';

// class Queue {
//   constructor() {
//     this.head = null;
//     this.tail = null;
//     this._size = 0;
//   }

//   add(item) {
//     const first = this.head;
//     this.head = { item, next: first, prev: null };
//     if (!first) this.tail = this.head;
//     else first.prev = this.head;
//     this._size++;
//   }

//   get() {
//     const last = this.tail;
//     if (!last) return null;
//     const { item, prev } = last;
//     this.tail = prev;
//     if (prev) prev.next = null;
//     else this.head = null;
//     this._size--;
//     return item;
//   }

//   remove(item) {
//     let v = this.head;
//     while (v) {
//       if (v.item === item) break;
//       v = v.next;
//     }
//     if (!v) return;
//     if (v.prev) v.prev.next = v.next;
//     if (v.next) v.next.prev = v.prev;
//   }

//   get size() {
//     return this._size;
//   }
// }

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
    this._size--;
    return item;
  }

  remove(item) {
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

  get size() {
    return this._size;
  }
}

module.exports = { Queue };
