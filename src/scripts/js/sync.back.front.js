const {
  backPath, frontPath, fromBackToFront, excludeFromBack,
  fromFrontToBack, excludeFromFront,
  frontStaticPath, backStaticPath, excludeStatic
} = require('./constants');
const { copyDir, logFromTo } = require('./utils');

const runSync = async () => {
  console.log('[-- copy client API from BACK to FRONT --] ');
  logFromTo(backPath, frontPath);
  await copyDir(backPath, frontPath, fromBackToFront, excludeFromBack);
  console.log('\n[-- copy client API from FRONT to BACK --]');
  logFromTo(backPath, frontPath);
  await copyDir(frontPath, backPath, fromFrontToBack, excludeFromFront);
  console.log('\n[-- copy STATIC from FRONT to BACK --]');
  logFromTo(backPath, frontPath);
  await copyDir(frontStaticPath, backStaticPath, null, excludeStatic);
};
runSync();
