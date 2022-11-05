import {
  backPath, fromBackToFront,
  fromFrontToBack, frontPath,
} from './constants';
import { copyDir } from './utils';

const runSync = async () => {
  console.log('from BACK to FRONT');
  await copyDir(backPath, frontPath, fromBackToFront);
  console.log('\nfrom FRONT to BACK');
  await copyDir(frontPath, backPath, fromFrontToBack);
};

runSync();
