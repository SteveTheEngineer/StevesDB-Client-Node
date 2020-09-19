import { ComparatorOperation } from "./comparatoroperation";

export interface EntryFilter {
    [key: string]: {operation: ComparatorOperation, value: string | boolean | number} | string | boolean | number;
}