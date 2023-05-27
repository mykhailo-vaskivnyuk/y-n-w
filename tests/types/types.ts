import {
  IParams, TOperationResponse,
} from '../../src/types/operation.types';

export type TTestCase = (state: Record<string, any>) => ITestCase;

export interface ITestCase {
  task: string;
  operations: IOperationData[];
}

export interface IOperationData {
  name: string;
  params: IParams;
  response: TOperationResponse;
}

export interface ITestCases {
  [key: string]: TTestCase | ITestCases;
}
// export interface ITestCases {
//   account: ICasesAccount;
//   net: ICasesNet;
// }
