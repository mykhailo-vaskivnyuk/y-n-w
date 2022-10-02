
export interface IConnection {
    onOperation: (cb: (operation: IOperation) => Promise<IOperationResponce>) => this;
    start(): void;
}

export interface IOperation {

}

export interface IOperationResponce {

}

export interface IRouting {
    runOperation(operation: IOperation): Promise<IOperationResponce>;
}
