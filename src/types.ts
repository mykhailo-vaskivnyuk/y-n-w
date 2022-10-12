export type TParameter<T extends any[]> = T[0];
export type TPromiseExecutor = TParameter<ConstructorParameters<typeof Promise>>;
export type TValue<T extends Record<string, unknown>> = T[keyof T];