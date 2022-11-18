export const logData = (data: any, message?: string) => {
  let log = data?.data || data;
  let password;
  if (log && typeof log === 'object') {
    password = 'password' in log ? { password: '*****' } : undefined;
    log = data.data ?
      { ...data, data: { ...log, ...password } } :
      { ...log, ...password };
  } else log = { ...data };
  message && console.log(`${message}\n`);
  console.log(log);
};

export const delay = (time: number) =>
  new Promise((rv) => {
    setTimeout(rv, time);
  });
