
export interface IConnection {
    onOperation: (cb: (operation: IOperation) => Promise<IOperationResponce>) => this;
    start(): void;
}

export interface IOperation {
    name: string[];
    data: Record<string, unknown>;
}

export interface IOperationResponce {

}

export interface IRouting {
    runOperation(operation: IOperation): Promise<IOperationResponce>;
}
