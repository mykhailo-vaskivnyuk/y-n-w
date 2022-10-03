import { IOperation, IOperationResponce } from "../app/types";

export type Handler = (data: IOperation["data"]) => Promise<IOperationResponce>;

export interface IRoutes {
  [K: string]: Handler| IRoutes;
};
