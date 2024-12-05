import { IOperation, TOperationResponse } from '../../types/operation.types';
import { IControllerConfig, IContext, THandler } from '../types';
import { INPUT_MODULES_MAP, OUTPUT_MODULES_MAP } from '../constants';
import { createPathResolve } from '../../utils/utils';

export function createInputModules(config: IControllerConfig) {
  const { modulesPath, inputModules, modulesConfig } = config;
  const resolvePath = createPathResolve(modulesPath);

  const modules = inputModules.map((module) => {
    const moduleConfig = modulesConfig[module];
    const modulePath = resolvePath(INPUT_MODULES_MAP[module]);
    const moduleExport = require(modulePath).default;
    return moduleExport(moduleConfig);
  });

  const execInputModules = async (
    { ...operation }: IOperation,
    context: IContext,
    handler: THandler,
  ): Promise<IOperation> => {
    for (const module of modules)
      operation = await module(operation, context, handler);
    return operation;
  };

  return execInputModules;
}

export const createOutputModules = (config: IControllerConfig) => {
  const { modulesPath, outputModules, modulesConfig } = config;
  const resolvePath = createPathResolve(modulesPath);

  const modules = outputModules.map((module) => {
    const moduleConfig = modulesConfig[module];
    const modulePath = resolvePath(OUTPUT_MODULES_MAP[module]);
    const moduleExport = require(modulePath).default;
    return moduleExport(moduleConfig);
  });

  const execOutputModules = async (
    response: TOperationResponse,
    context: IContext,
    handler: THandler,
  ): Promise<TOperationResponse> => {
    for (const module of modules)
      response = await module(response, context, handler);
    return response;
  };

  return execOutputModules;
};
