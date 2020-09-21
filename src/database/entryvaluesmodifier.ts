import { EntryValueOperation } from "./entryvalueoperation";

export interface EntryValuesModifier {
    [column: string]: {
        /**
         * Entry value operation
         */
        operation: EntryValueOperation;
        /**
         * Modifier value
         */
        value: string | number | boolean;
    } | string | number | boolean;
}