export type TParameter<T extends any[]> = T[0];

export type TPromiseExecutor<T> =
  TParameter<ConstructorParameters<typeof Promise<T>>>;

export type TPrimitiv =
  | string
  | number
  | boolean
  | null;

export interface IObject {
  [key: string]:
    | TPrimitiv
    | IObject
    | (TPrimitiv | IObject)[];
}
