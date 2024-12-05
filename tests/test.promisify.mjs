import { promisify6 } from '../lib/promisify.mjs';

const fn = async (arg, callback) => {
  new Promise((rv, rj) => setTimeout(rv, arg, 'done'))
    .then((r) => callback(null, r))
    .catch((e) => callback(e, undefined));
};

const fnPromisified = promisify6(fn);

fnPromisified(5000, 2000).then(console.log).catch(console.log);
