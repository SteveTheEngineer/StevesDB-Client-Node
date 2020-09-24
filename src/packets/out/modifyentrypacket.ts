import { EntryFilter } from "../../database/entryfilter";
import { EntryValueOperation } from "../../database/entryvalueoperation";
import { EntryValuesModifier } from "../../database/entryvaluesmodifier";
import { ComparatorOperation } from "../../stevesdbclient";
import { PacketBuilder } from "../../util/packetbuilder";
import { PacketOut } from "../packetout";

export class ModifyEntryPacket extends PacketOut {
    private readonly database: string;
    private readonly table: string;
    private readonly filters: EntryFilter;
    private readonly startIndex: number;
    private readonly endIndex: number;
    private readonly values: EntryValuesModifier;

    public constructor(database: string, table: string, filters: EntryFilter, startIndex: number, endIndex: number, values: EntryValuesModifier) {
        super();
        this.database = database;
        this.table = table;
        this.filters = filters;
        this.values = values;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
    }

    serialize(): Buffer {
        const builder: PacketBuilder = new PacketBuilder().string(this.database).string(this.table);
        builder.int(Object.keys(this.filters).length);
        for(const name in this.filters) {
            const requirement = this.filters[name];
            builder.string(name);
            let operation: ComparatorOperation = ComparatorOperation.EQUAL_TO;
            let value: string = requirement.toString();
            if(typeof requirement === "object") {
                operation = requirement.operation;
                value = requirement.value.toString();
            }
            builder.unsignedByte(operation);
            builder.string(value);
        }

        builder.int(this.startIndex);
        builder.int(this.endIndex);
        
        builder.int(Object.keys(this.values).length);
        for(const column in this.values) {
            const modifier = this.values[column];
            builder.string(column);
            let operation: EntryValueOperation = EntryValueOperation.SET;
            let value: string = modifier.toString();
            if(typeof modifier ===  "object") {
                operation = modifier.operation;
                value = modifier.value.toString();
            }
            builder.unsignedByte(operation);
            builder.string(value);
        }
        return builder.build();
    }
    getId(): number {
        return 19;
    }
}