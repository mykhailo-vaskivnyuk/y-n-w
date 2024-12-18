import { mock } from 'node:test';
import { TFetch } from '../../src/client/common/client/connection/types';
import { TTransport } from '../../src/server/types';
import { IConfig } from '../../src/types/config.types';
import { IParams, TOperationResponse } from '../../src/types/operation.types';

export interface ITestCase {
  title: string;
  dbDataFile?: string;
  connection: TTransport;
  config?: Partial<IConfig>;
  caseUnits: ([TTestUnit, number] | TTestUnit)[];
}

export type TTestUnit = (state: Record<string, any>) => ITestUnit;

export interface ITestUnit {
  title: string;
  operations: IOperationData[];
}

export interface ITestUnits {
  [key: string]: ((...args: any[]) => TTestUnit) | TTestUnit | ITestUnits;
}

export interface IOperationData {
  name: string;
  params?: IParams | (() => IParams);
  expected?: TOperationResponse | ((actual: any) => void);
  setToState?: (actual: any) => void;
  query?: () => Promise<Record<string, any>[]>;
  expectedQueryResult?: TOperationResponse | ((actual: any) => void);
}

export interface ITestRunnerData {
  title: string;
  connections: TFetch[];
  onMessage: TMockFunction[];
  testUnits: [TTestUnit, number][];
}

export type TMockFunction = ReturnType<typeof mock.fn<(data: any) => void>>;
