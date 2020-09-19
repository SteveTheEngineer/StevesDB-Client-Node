import { EntryValueOperation } from "./entryvalueoperation";

export interface EntryValuesModifier {
    [column: string]: {operation: EntryValueOperation, value: string | number | boolean} | string | number | boolean;
}