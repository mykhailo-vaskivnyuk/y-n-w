const { frontPath, backPath } = require('./constants');
const { copyDir } = require('./utils');

const runSync = async () => {
  console.log('copy ALL from BACK to FRONT');
  await copyDir(frontPath, backPath);
};
runSync();
