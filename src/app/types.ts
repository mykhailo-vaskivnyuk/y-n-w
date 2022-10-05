export interface IConnection {
    onOperation: (cb: (operation: IOperation) => Promise<IOperationResponce>) => this;
    start(): void;
}

export interface IOperation {
    names: string[];
    data: Record<string, unknown>;
}

export interface IOperationResponce {
    //
}

export interface IRouter {
    init(): Promise<void>;
    exec(operation: IOperation): Promise<IOperationResponce>;
}

export interface IDatabase {
    init(): Promise<this>;
}
