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
  cases: (cases: ITestCasesTree) => TTestCase[];
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
  params: IParams;
  response: TOperationResponse;
}

export interface ITestRunnerData {
  title: string;
  connection: TFetch;
  testCases: ITestCase[];
}
