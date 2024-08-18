export const startTimer = (
  timeout,
  callback,
  error = new Error('TIMEDOUT'),
) => {
  let timer = null;

  if (timeout) {
    const onTimedout = () => {
      timer = null;
      if (callback) callback(error);
    };
    timer = setTimeout(onTimedout, timeout);
  }

  return () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
};
