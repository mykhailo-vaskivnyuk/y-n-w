import { IOperation, IOperationResponce } from '../app/types';

export type Handler = (data: IOperation['data']) => Promise<IOperationResponce>;

export interface IRoutes {
  [key: string]: Handler | IRoutes;
}
