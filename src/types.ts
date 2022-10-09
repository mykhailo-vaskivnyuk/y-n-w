export type TParameter<T extends any[]> = T[0];
export type TPromiseExecutor = TParameter<ConstructorParameters<typeof Promise>>;
