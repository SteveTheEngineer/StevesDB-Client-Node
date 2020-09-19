import { ComparatorOperation } from "./comparatoroperation";

export interface EntryFilter {
    [key: string]: {
        /**
         * Comparator operation
         */
        operation: ComparatorOperation;
        /**
         * Compared value
         */
        value: string | boolean | number;
    } | string | boolean | number;
}