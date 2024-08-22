/* eslint-disable max-lines */
import { Timeout } from './timeout.class.mjs';
import { startTimer } from './start.timer.mjs';

export const promisify1 = (fn) => (...args) => {
  const ps = Promise.withResovers();
  let done = false;

  /* callback */
  const callback = (error, data) => {
    if (done) return;
    done = true;
    if (error) ps.reject(error);
    else ps.resolve(data);
  };

  /* if timeout */
  const timeout = args.pop();
  if (timeout) {
    const signal = AbortSignal.timeout(timeout);
    const err = new Error('TIMEDOUT');
    signal.addEventListener('abort', () => callback(err));
  }

  /* if fn result */
  fn(...args, callback);

  return ps.promise;
};

export const promisify2 = (fn) => (...args) => {
  let done = false;
  let timer = null;
  return new Promise((rv, rj) => {
    const callback = (error, data) => {
      if (done) return void 0;
      done = true;
      if (timer) clearTimeout(timer);
      if (error) rj(error);
      else rv(data);
    };
    const timeout = args.pop();
    if (timeout) {
      timer = setTimeout(() => {
        timer = null;
        callback(new Error('TIMEDOUT'));
      }, timeout);
    }
    fn(...args, callback);
  });
};

export const promisify4 = (fn) => (...args) =>
  new Promise((rv, rj) => {
    let done = false;
    let timer = null;
    const callback = (error, data) => {
      if (done) return;
      done = true;
      timer.clear();
      if (error) rj(error);
      else rv(data);
    };
    const timeout = args.pop();
    timer = new Timeout(timeout, callback);
    fn(...args, callback);
  });

export const promisify5 = (fn) => (...args) => {
  const ps = Promise.withResovers();
  let done = false;
  let clearTimer = null;
  const callback = (error, data) => {
    if (done) return;
    done = true;
    clearTimer();
    if (error) ps.reject(error);
    else ps.resolve(data);
  };
  const timeout = args.pop();
  clearTimer = startTimer(timeout, callback);
  fn(...args, callback);
  return ps.promise;
};
