export const logData = (data: any, message?: string) => {
  let log = data?.data || data;
  let password;
  if (log && typeof log === 'object') {
    password = 'password' in log ? { password: '*****' } : undefined;
    log = data.data ?
      { ...data, data: { ...log, ...password } } :
      { ...log, ...password };
  }
  message && console.log(`${message}\n`);
  console.log(log);
};
