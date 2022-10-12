export type TParameter<T extends any[]> = T[0];

export type TPromiseExecutor =
  TParameter<ConstructorParameters<typeof Promise>>;

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
