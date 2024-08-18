import { promisify1 } from '../lib/promisify.mjs';

const fn = async (arg, callback) => {
  new Promise((rv, rj) => setTimeout(rv, arg, 'done'))
    .then((r) => callback(null, r))
    .catch((e) => callback(e, undefined));
};

const fnPromisified = promisify1(fn);

fnPromisified(500, 1000)
  .then(console.log)
  .catch(console.log);
