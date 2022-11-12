import { IOperation, TOperationResponse } from '../../types/operation.types';
import {
  IContext, IRouterConfig, THandler,
  TInputModule, TOutputModule,
} from '../types';
import { INPUT_MODULES_MAP, OUTPUT_MODULES_MAP } from '../constants';
import { createPathResolve } from '../../utils/utils';

export function applyInputModules(config: IRouterConfig) {
  const { modulesPath, inputModules, modulesConfig } = config;
  const resolvePath = createPathResolve(modulesPath);
  return inputModules.map(
    (module) => {
      const moduleConfig = modulesConfig[module];
      const modulePath = resolvePath(INPUT_MODULES_MAP[module]);
      const moduleExport = require(modulePath).default;
      return moduleExport(moduleConfig);
    });
}

export const applyOutputModules = (config: IRouterConfig) => {
  const { modulesPath, outputModules, modulesConfig } = config;
  const resolvePath = createPathResolve(modulesPath);
  return outputModules.map(
    (module) => {
      const moduleConfig = modulesConfig[module];
      const modulePath = resolvePath(OUTPUT_MODULES_MAP[module]);
      const moduleExport = require(modulePath).default;
      return moduleExport(moduleConfig);
    });
};

export const runInputModules = (
  inputModules: ReturnType<TInputModule>[],
) => async (
  { ...operation }: IOperation, context: IContext, handler: THandler
): Promise<IOperation> => {
  for (const module of inputModules) {
    operation = await module(operation, context, handler);
  }
  return operation;
};

export const runOutputModules = (
  outputModules: ReturnType<TOutputModule>[],
) => async (
  response: TOperationResponse, context: IContext, handler: THandler
): Promise<TOperationResponse> => {
  for (const module of outputModules)
    response = await module(response, context, handler);
  return response;
};
