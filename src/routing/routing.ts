import { IRouting, IOperation, IOperationResponce } from "../app/types";
import fsp from "node:fs/promises";
import path from "node:path";

type IHandler = (data: IOperation["data"]) => Promise<IOperationResponce>;

class Routing implements IRouting {
    private routes: Record<string, unknown>;

    constructor() {
        this.routes = {};
        this.createRoutes("js/logic", this.routes);
    }

    async runOperation(operation: IOperation): Promise<IOperationResponce> {
        const { name, data } = operation;
        let handler = this.routes as unknown as IHandler | Record<string, IHandler>;
        const isHandler = (handler: IHandler | Record<string, IHandler>): handler is IHandler => {
            return typeof handler === "function";
        };
        for (const key of name) {
            if (!handler || isHandler(handler)) return {};
            handler = handler[key] as unknown as IHandler | Record<string, IHandler>;
        }
        if (isHandler(handler)) return handler(data);
        return {};
    }

    private async createRoutes(folder: string, routes: Record<string, unknown>) {
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
                this.createRoutes(dirPath, routes[name] as Record<string, unknown>);
            }
        }
    }
}

export = new Routing();
