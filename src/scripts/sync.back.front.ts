import {
  backPath, frontPath, fromBackToFront, fromFrontToBack,
  excludeFromBack, excludeFromFront,
  frontStaticPath, backStaticPath, excludeStatic, filesToCopyFromBackToFront,
} from './constants';
import { copyDir, copyFiles, logFromTo } from './utils';

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

  console.log('\n[-- copy FILES from BACK to FRONT --]\n');
  await copyFiles(filesToCopyFromBackToFront);
};

runSync();
