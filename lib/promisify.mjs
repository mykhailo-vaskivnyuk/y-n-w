/* eslint-disable max-lines */
import { Timeout } from './timeout.class.mjs';
import { startTimer } from './start.timer.mjs';

export const promisify1 = (fn) => (...args) => {
  let done = false;
  return new Promise((rv, rj) => {
    /* callback */
    const callback = (error, data) => {
      if (done) return void 0;
      done = true;
      if (error) rj(error);
      else rv(data);
    };
    /* if timedout */
    const timeout = args.pop();
    if (timeout) {
      const e = new Error('TIMEDOUT');
      const signal = AbortSignal.timeout(timeout);
      signal.addEventListener('abort', () => callback(e));
    }
    /* if fn result */
    fn(...args, callback);
  });
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
      const e = new Error('TIMEDOUT');
      timer = setTimeout(() => {
        timer = null;
        callback(e);
      }, timeout);
    }
    fn(...args, callback);
  });
};

export const promisify3 = (fn) => (...args) => {
  let done = false;
  let timer = null;
  let timedout = false;
  const timeout = args.pop();
  if (timeout) {
    timer = setTimeout(() => {
      timer = null;
      timedout = true;
    }, timeout);
  }
  return new Promise((rv, rj) => {
    const callback = (error, data) => {
      if (done) return void 0;
      done = true;
      if (timer) clearTimeout(timer);
      if (timedout) rj(new Error('TIMEDOUT'));
      else if (error) rj(error);
      else rv(data);
    };
    fn(...args, callback);
  });
};

export const promisify4 = (fn) => (...args) =>
  new Promise((rv, rj) => {
    const state = { done: false, timer: null };
    const callback = (error, data) => {
      if (state.done) return void 0;
      state.done = true;
      state.timer.clear();
      if (error) rj(error);
      else rv(data);
    };
    const timeout = args.pop();
    state.timer = new Timeout(timeout, callback);
    fn(...args, callback);
  });


export const promisify5 = (fn) => (...args) =>
  new Promise((rv, rj) => {
    const state = { done: false, clearTimer: null };
    const callback = (error, data) => {
      if (state.done) return void 0;
      state.done = true;
      state.clearTimer();
      if (error) rj(error);
      else rv(data);
    };
    const timeout = args.pop();
    state.clearTimer = startTimer(timeout, callback);
    fn(...args, callback);
  });

export const promisify6 = (fn) => (...args) => {
  let done = false;
  const timeout = args.pop();
  const timer = new Timeout(timeout);
  return new Promise((rv, rj) => {
    const callback = (error, data) => {
      if (done) return void 0;
      done = true;
      const timedout = timer.end();
      if (timedout) rj(new Error('TIMEDOUT'));
      else if (error) rj(error);
      else rv(data);
    };
    fn(...args, callback);
  });
};
