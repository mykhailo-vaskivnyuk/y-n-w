import {
  BACK_PATH,
  FRONT_PATH,
  FROM_BACK_TO_FRONT,
  FROM_FRONT_TO_BACK,
  EXCLUDE_FROM_BACK,
  EXCLUDE_FROM_FRONT,
  FRONT_STATIC_PATH,
  BACK_STATIC_PATH,
  EXCLUDE_STATIC,
  FILES_TO_COPY_FROM_BACK_TO_FRONT,
} from './constants';
import { copyDir, copyFiles, logFromTo } from './utils';

const runSync = async () => {
  console.log('[-- copy client API from BACK to FRONT --] ');
  logFromTo(BACK_PATH, FRONT_PATH);
  await copyDir(BACK_PATH, FRONT_PATH, FROM_BACK_TO_FRONT, EXCLUDE_FROM_BACK);

  console.log('\n[-- copy client API from FRONT to BACK --]');
  logFromTo(BACK_PATH, FRONT_PATH);
  await copyDir(FRONT_PATH, BACK_PATH, FROM_FRONT_TO_BACK, EXCLUDE_FROM_FRONT);

  console.log('\n[-- copy STATIC from FRONT to BACK --]');
  logFromTo(BACK_PATH, FRONT_PATH);
  await copyDir(FRONT_STATIC_PATH, BACK_STATIC_PATH, null, EXCLUDE_STATIC);

  console.log('\n[-- copy FILES from BACK to FRONT --]\n');
  await copyFiles(FILES_TO_COPY_FROM_BACK_TO_FRONT);
};

runSync();
