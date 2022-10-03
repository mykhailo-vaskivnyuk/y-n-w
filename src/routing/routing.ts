import { IRouting, IOperation, IOperationResponce } from "../app/types";
import fsp from "node:fs/promises";
import path from "node:path";
import { Handler, IRoutes } from "./types";

class Routing implements IRouting {
    private routes: IRoutes = {};

    constructor() {
        this.createRoutes("js/logic", this.routes);
    }

    async runOperation(operation: IOperation): Promise<IOperationResponce> {
        const { name, data } = operation;
        let handler: IRoutes | Handler = this.routes;
        for (const key of name) {
            if (!handler || this.isHandler(handler)) return {};
            handler = handler[key];
        }
        if (this.isHandler(handler)) return handler(data);
        return {};
    }

    private async createRoutes(folder: string, routes: IRoutes) {
        const logicPath = path.resolve(folder);
        const dir = await fsp.opendir(logicPath);
        for await (const item of dir) {
            const ext = path.extname(item.name);
            const name = path.basename(item.name, ext);
            if (item.isFile()) {
                if (ext !== '.js') continue;
                const filePath = path.join(logicPath, name);
                routes[name] = require(filePath);
            } else {
                const dirPath = path.join(logicPath, name);
                routes[name] = {};
                this.createRoutes(dirPath, routes[name] as IRoutes);
            }
        }
    }

    private isHandler(handler: IRoutes | Handler): handler is Handler {
        return typeof handler === "function";
    };
}

export = new Routing();
