"use strict";
const http = require("http");
class HttpConnection {
    server = http.createServer((req, res) => this.onRequest(req, res));
    onOperationCb = null;
    onOperation(cb) {
        this.onOperationCb = cb;
        return this;
    }
    start() {
        this.server.listen(8000);
    }
    onRequest(...[req, res]) {
        const { method, url } = req;
        const operation = { method, url };
        console.log(operation);
        if (!this.onOperationCb)
            return;
        this.onOperationCb(operation)
            .then(JSON.stringify)
            .then((body) => res.end(body));
    }
}
module.exports = new HttpConnection();
