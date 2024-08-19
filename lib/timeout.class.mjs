export class Timeout {
  #callback = null;
  #error = null;
  #timer = null;
  timedout = false;

  constructor(timeout, callback, error) {
    this.#callback = callback;
    this.#error = error || new Error('TIMEDOUT');
    this.#start(timeout);
  }

  #start(timeout) {
    if (!timeout) return void 0;
    this.#timer = setTimeout(() => this.#finish(), timeout);
  }

  #finish() {
    this.#timer = null;
    this.timedout = true;
    if (this.#callback) {
      this.#callback(this.#error);
    }
  }

  clear() {
    if (this.#timer) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
    return this.timedout;
  }
}
