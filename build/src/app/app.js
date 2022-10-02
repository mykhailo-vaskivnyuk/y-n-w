"use strict";
class App {
    connection = null;
    routing = null;
    setConnection(connection) {
        this.connection = connection;
        this.connection.onOperation((operation) => {
            if (!this.routing)
                throw Error('Routing is not set');
            return this.routing.runOperation(operation);
        });
        return this;
    }
    setRouting(routing) {
        this.routing = routing;
        return this;
    }
    start() {
        this.connection?.start();
        return this;
    }
}
module.exports = new App();
