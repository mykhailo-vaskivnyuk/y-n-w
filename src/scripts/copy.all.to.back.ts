import { backPath, frontPath } from './constants';
import { copyDir } from './utils';

const runSync = async () => {
  console.log('copy ALL from BACK to FRONT');
  await copyDir(frontPath, backPath);
};

runSync();