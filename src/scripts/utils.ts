import fsp from 'node:fs/promises';
import path from 'node:path';

export const copyDir = async (
  dirFrom: string, dirTo: string, include?: string[],
) => {
  const dir = await fsp.opendir(dirFrom);
  for await (const item of dir) {
    const { name } = item;
    if (item.isDirectory()) {
      if (name === 'local') continue;
      const nextDirBack = path.join(dirFrom, name);
      const nextDirFront = path.join(dirTo, name);
      await copyDir(nextDirBack, nextDirFront, include);
      continue;
    }
    if (include && !include.includes(dirFrom)) continue;
    const filePathFrom = path.join(dirFrom, name);
    const filePathTo = path.join(dirTo, name);
    fsp.copyFile(filePathFrom, filePathTo);
    console.log('copying', filePathFrom);
  }
};
