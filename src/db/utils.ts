import path from 'node:path';
import fsp from 'node:fs/promises';
import { IQueries, TQueriesModule, TQuery } from './types/types';

export const userInSubnets = (userIndex = 1, netIndex = 2) => `
  members.user_id = $${userIndex} AND
  nets.root_net_id = $${netIndex} AND
  nets.net_level > (
    SELECT net_level FROM nets WHERE net_id = $${netIndex}
  )
`;

const createQueries = (
  filePath: string,
  sqlToQuery: (sql: string, filePath: string) => TQuery,
): IQueries | TQuery => {
  let moduleExport = require(filePath);
  moduleExport = moduleExport.default || (moduleExport as TQueriesModule);
  if (typeof moduleExport === 'string') {
    return sqlToQuery(moduleExport, filePath);
  }
  return Object.keys(moduleExport).reduce<IQueries>((queries, key) => {
    queries[key] = sqlToQuery(moduleExport[key]!, filePath + '/' + key);
    return queries;
  }, {});
};

export const readQueries = async (
  dirPath: string,
  sqlToQuery: (sql: string, filePath: string) => TQuery,
): Promise<IQueries> => {
  const query: IQueries = {};
  const queryPath = path.resolve(dirPath);
  const dir = await fsp.opendir(queryPath);
  for await (const item of dir) {
    const ext = path.extname(item.name);
    const name = path.basename(item.name, ext);
    if (item.isDirectory()) {
      const dirPath = path.join(queryPath, name);
      query[name] = await readQueries(dirPath, sqlToQuery);
      continue;
    }

    if (ext !== '.js') continue;

    const filePath = path.join(queryPath, item.name);
    const queries = createQueries(filePath, sqlToQuery);
    if (name === 'index') Object.assign(query, queries);
    else query[name] = queries;
  }
  // dir.close();
  return query;
};
