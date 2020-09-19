import { ComparatorOperation } from "../../database/comparatoroperation";
import { EntryFilter } from "../../database/entryfilter";
import { PacketBuilder } from "../../util/packetbuilder";
import { PacketOut } from "../packetout";

export class ListEntriesPacket extends PacketOut {
    private readonly database: string;
    private readonly table: string;
    private readonly start: number;
    private readonly end: number;
    private readonly filters: EntryFilter;

    public constructor(database: string, table: string, start: number, end: number, filters: EntryFilter) {
        super();
        this.database = database;
        this.table = table;
        this.start = start;
        this.end = end;
        this.filters = filters;
    }

    serialize(): Buffer {
        const builder: PacketBuilder = new PacketBuilder().string(this.database).string(this.table).int(this.start).int(this.end);
        builder.int(Object.keys(this.filters).length);
        for(const column in this.filters) {
            const requirement = this.filters[column];
            builder.string(column);
            let operation: ComparatorOperation = ComparatorOperation.EQUAL_TO;
            let value: string = requirement.toString();
            if(typeof requirement === "object") {
                operation = requirement.operation;
                value = requirement.value.toString();
            }
            builder.unsignedByte(operation);
            builder.string(value);
        }
        return builder.build();
    }
    getId(): number {
        return 17;
    }
}