import { EntryFilter } from "../../database/entryfilter";
import { ComparatorOperation } from "../../stevesdbclient";
import { PacketBuilder } from "../../util/packetbuilder";
import { PacketOut } from "../packetout";

export class RemoveEntryPacket extends PacketOut {
    private readonly database: string;
    private readonly table: string;
    private readonly filters: EntryFilter;
    private readonly startIndex: number;
    private readonly endIndex: number;

    public constructor(database: string, table: string, filters: EntryFilter, startIndex: number, endIndex: number) {
        super();
        this.database = database;
        this.table = table;
        this.filters = filters;
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

        return builder.build();
    }
    getId(): number {
        return 20;
    }
}