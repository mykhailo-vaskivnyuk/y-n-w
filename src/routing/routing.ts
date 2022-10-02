import { IOperation, IOperationResponce } from "../app/types";
import { IRouting } from "../app/types";

class Routing implements IRouting {
    private routes;

    constructor() {
        this.routes = {};
    }

    runOperation(operation: IOperation): Promise<IOperationResponce> {
        return Promise.resolve({ ...operation, from: 'routing' });
    }
}

export = new Routing();
