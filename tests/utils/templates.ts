import { format } from 'node:util';

const tplHeader =
`/* eslint-disable max-lines */
/* eslint-disable max-len */
import { TTestCase } from './types';

export interface ITestCasesTree `;
const tplKey = '\n%s\'%s\': ';
const tplType = 'TTestCase;';
const tplFooter = '\n';

export const strHeader = () => tplHeader;
export const strKey = (
  indent: string,
  key: string
) => format(tplKey, indent, key);
export const strType = () => tplType;
export const strFooter = () => tplFooter;
