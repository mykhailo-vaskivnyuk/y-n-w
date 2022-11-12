import { BACK_PATH, FRONT_PATH } from './constants';
import { copyDir } from './utils';

const runSync = async () => {
  console.log('copy ALL from BACK to FRONT');
  await copyDir(BACK_PATH, FRONT_PATH);
};

runSync();
