const { backPath, frontPath } = require('./constants');
const { copyDir } = require('./utils');

const runSync = async () => {
  console.log('copy ALL from BACK to FRONT');
  await copyDir(backPath, frontPath);
};
runSync();
