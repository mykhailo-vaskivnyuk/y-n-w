exports.Transport = class Transport {
  #onrequest;
  #counter = 100;

  onRequest(cb) {
    this.#onrequest = cb;
  }

  async send(response) {
    await new Promise((rv) => setTimeout(rv, 50));
    console.log('transport send', response);
  }

  async listen() {
    for (let i = this.#counter; i > 0; i--) {
      await new Promise((rv) => setTimeout(rv, 50));
      this.#onrequest(i);
    }
  }
};
