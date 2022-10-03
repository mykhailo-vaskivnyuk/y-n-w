import { type IOperation, type IOperationResponce } from "../../app/types";

const user = (operation: IOperation["data"]): IOperationResponce => {
    return { ...operation, from: 'user' };
}
export = user;
