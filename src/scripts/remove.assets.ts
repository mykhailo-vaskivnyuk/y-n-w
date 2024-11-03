import { rmDir } from './utils';

const removeAssets = async () => {
  console.log('[-- remove ASSETS dir --]\n');
  await rmDir('./public/assets');
};

removeAssets();
