import { Readable } from 'node:stream';

export type TPrimitiv = string | number | boolean | null;

export interface IObject {
  [key: string | number | symbol]:
    | TPrimitiv
    | IObject
    | TPrimitiv[]
    | IObject[]
    | Readable;
}

export type GetParamsTypes<T extends [string, any][]> = {
  [key in keyof T]: T[key][1];
};
