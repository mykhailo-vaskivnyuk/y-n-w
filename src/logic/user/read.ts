import { type IOperation, type IOperationResponce } from "../../app/types";
import queries from '../../db/queries/index';

const user = (operation: IOperation["data"]): IOperationResponce => {
    return queries.getUsers();
}

export = user;
