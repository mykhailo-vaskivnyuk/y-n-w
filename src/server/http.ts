import { IConnection, IOperation, IOperationResponce } from "../app/types";
import http = require('http');

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
        const operation = { method, url } as IOperation;
        console.log(operation);

        if (!this.onOperationCb) return;
        
        this.onOperationCb(operation)
            .then(JSON.stringify)
            .then((body) => res.end(body));
    }
}

export = new HttpConnection();
