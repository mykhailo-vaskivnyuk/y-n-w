import path from 'node:path';
import fsp from 'node:fs/promises';

export class DirLoader<Result extends Record<string, unknown>> {
  #dirPath: string;
  #options = {
    exclude: [] as string[],
    include: ['.js'] as string[],
  };

  constructor(dirPath: string, options: any = {}) {
    this.#dirPath = path.resolve(dirPath);
    this.#options = { ...this.#options, ...options };
  }

  async load(dirPath = this.#dirPath) {
    const dir = await fsp.opendir(dirPath);

    const container = {} as any;
    const { exclude, include } = this.#options;

    for await (const item of dir) {
      const ext = path.extname(item.name);
      const name = path.basename(item.name, ext);
      if (exclude.includes(name)) continue;

      if (item.isDirectory()) {
        const subDirPath = path.join(dirPath, name);
        container[name] = await this.load(subDirPath);
        continue;
      }

      if (!include.includes(ext)) {
        continue;
      }

      const filePath = path.join(dirPath, item.name);
      const result = this.#action(filePath);

      if (name !== 'index') {
        container[name] = result;
        continue;
      }

      /* for index file */
      if (typeof result === 'function') {
        throw new Error(`Wrong module: ${filePath}`);
      }

      Object.assign(container, result);
    }

    return container as Result;
  }

  #action(filePath: string) {
    const moduleExport = require(filePath);
    return moduleExport.default || moduleExport;
  }
}
