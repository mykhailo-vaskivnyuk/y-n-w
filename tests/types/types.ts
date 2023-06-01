import { TFetch } from '../../src/client/common/client/connection/types';
import { TTransport } from '../../src/server/types';
import {
  IParams, TOperationResponse,
} from '../../src/types/operation.types';
import { ITestCasesTree } from './test.cases.types';

export interface ITestData {
  title: string;
  dbData: string;
  connection: TTransport;
  connCount?: number;
  cases: (cases: ITestCasesTree) => ([TTestCase, number] | TTestCase)[];
}

export type TTestCase = (state: Record<string, any>) => ITestCase;

export interface ITestCase {
  title: string;
  operations: IOperationData[];
}

export interface ITestCases {
  [key: string]: TTestCase | ITestCases;
}

export interface IOperationData {
  name: string;
  params?: IParams | (() => IParams);
  expected?:
    | TOperationResponse
    | ((actual: any) => void);
  toState?: (response: any) => void;
}

export interface ITestRunnerData {
  title: string;
  connections: TFetch[];
  testCases: [ITestCase, number][];
}
