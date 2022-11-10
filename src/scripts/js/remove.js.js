const { buildPath } = require('./constants');
const { rmDir } = require('./utils');

const removeJs = async () => {
  console.log('[-- remove JS dir --]\n');
  await rmDir(buildPath);
};
removeJs();
