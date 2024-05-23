const { ModuleBus } = require('./modules/module.bus');
const { ModuleTransport } = require('./modules/module.transport');
const { ModuleQueue } = require('./modules/module.queue');
const { ModulePool } = require('./modules/module.pool');
const { ModuleWorker } = require('./modules/module.worker');
const { ModuleController } = require('./modules/module.controller');

const modules = [
  (bus) => new ModuleTransport(bus, 'transport'),
  (bus) => new ModuleQueue(bus, 'queueRequest'),
  (bus) => new ModuleQueue(bus, 'queueResponse'),
  (bus) => new ModulePool(bus, 'pool'),
  (bus) => new ModuleWorker(bus, 'worker 1'),
  (bus) => new ModuleWorker(bus, 'worker 2'),
  (bus) => new ModuleWorker(bus, 'worker 3'),
  (bus) => new ModuleWorker(bus, 'worker 4'),
  (bus) => new ModuleWorker(bus, 'worker 5'),
  (bus) => new ModuleWorker(bus, 'worker 6'),
  (bus) => new ModuleWorker(bus, 'worker 7'),
  (bus) => new ModuleWorker(bus, 'worker 8'),
  // (bus) => new ModuleWorker(bus, 'worker 9'),
  // (bus) => new ModuleWorker(bus, 'worker 0'),
  (bus) => new ModuleController(bus, 'controller'),
];

new ModuleBus(modules);
