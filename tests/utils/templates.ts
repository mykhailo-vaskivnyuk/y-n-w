import { format } from 'node:util';

const tplHeader =
`/* eslint-disable max-lines */
/* eslint-disable max-len */
import { TTestUnit } from './types';

export interface ITestUnitsMap `;
const tplKey = '\n%s\'%s\': ';
const tplType = 'TTestUnit;';
const tplFooter = '\n';

export const strHeader = () => tplHeader;
export const strKey = (
  indent: string,
  key: string
) => format(tplKey, indent, key);
export const strType = () => tplType;
export const strFooter = () => tplFooter;
