/* eslint-disable no-loop-func */
const { Adapter } = require('../lib/adapter');

exports.ModuleBus = class ModuleBus extends Adapter {
  #modules = new Set();

  constructor(modules) {
    super();
    this.#create(modules);
    this.#init();
    this.emit('prepare');
  }

  #create(modules) {
    for (const Module of modules) {
      const module = Module(this);
      this.#modules.add(module);
    }
  }

  #init() {
    let prepared = 0;
    for (const module of this.#modules) {
      module.on('prepared', (module) => {
        console.log('Prepared:', module?.constructor.name);
        const available = this.#modules.has(module);
        if (available) prepared++;
        if (prepared === this.#modules.size) {
          this.emit('start');
        }
      });
    }
  }
};
