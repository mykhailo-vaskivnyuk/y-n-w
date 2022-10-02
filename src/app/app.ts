import { IConnection, IRouting } from "./types";

class App {
    private connection: IConnection | null = null;
    private routing: IRouting | null = null;

    setConnection(connection: IConnection) {
        this.connection = connection;
        this.connection.onOperation((operation) => {
            if (!this.routing) throw Error('Routing is not set') ;
            return this.routing.runOperation(operation);
        });
        return this;
    }

    setRouting(routing: IRouting) {
        this.routing = routing;
        return this;
    }

    start() {
        this.connection?.start();
        return this;
    }
}
 
export = new App();
