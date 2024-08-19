export const startTimer = (timeout, callback, error) => {
  let timer = null;
  const err = error || new Error('TIMEDOUT');

  if (timeout) {
    timer = setTimeout(() => {
      timer = null;
      if (callback) callback(err);
    }, timeout);
  }

  return () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
};
