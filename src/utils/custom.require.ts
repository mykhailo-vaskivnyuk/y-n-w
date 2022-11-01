import fs from 'node:fs';
// import path from 'node:path';
import vm from 'node:vm';
// console.log(module)
const customRequire = (p: string) => {
  const modulePath = require.resolve(p);
  const script = fs.readFileSync(modulePath).toString();
  const module = { exports: {} };
  console.log(require)
  const context = vm.createContext({ require, console, module, __filename: modulePath });
  vm.runInContext(script, context);
  return module.exports;
};

export = customRequire;
