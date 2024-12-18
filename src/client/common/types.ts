export type TParameter<T extends any[]> = T[0];

export type TPromiseExecutor<T> = TParameter<
  ConstructorParameters<typeof Promise<T>>
>;
