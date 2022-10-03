import { IConnection, IOperation, IOperationResponce } from "../app/types";
import http = require('http');

const CRUD = {
    get: 'read',
    post: 'create',
    put: 'update',
    delete: 'delete',
}

class HttpConnection implements IConnection {
    private server = http.createServer((req, res) => this.onRequest(req, res));
    private onOperationCb: ((operation: IOperation) => Promise<IOperationResponce>) | null = null;

    onOperation(cb: (operation: IOperation) => Promise<IOperationResponce>): this {
        this.onOperationCb = cb;
        return this;
    }

    start() {
        this.server.listen(8000);
    }

    private onRequest(...[req, res]: Parameters<http.RequestListener>) {
        const { method, url } = req;
        const name = (url || '').slice(1).split("/");
        const crud = CRUD[method?.toLowerCase() as keyof typeof CRUD];
        crud && name.push(crud);
        const data = {};
        const operation = { name, data } as IOperation;
        
        console.log('operation', operation);

        if (!this.onOperationCb) return;
        
        this.onOperationCb(operation)
            .then(JSON.stringify)
            .then((body) => res.end(body));
    }
}

export = new HttpConnection();
