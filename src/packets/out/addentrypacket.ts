import { TableColumnType } from "../../database/tablecolumntype";
import { PacketBuilder } from "../../util/packetbuilder";
import { PacketOut } from "../packetout";

export class AddEntryPacket extends PacketOut {
    private readonly database: string;
    private readonly table: string;
    private readonly values: Map<string, string>;

    public constructor(database: string, table: string, values: Map<string, string>) {
        super();
        this.database = database;
        this.table = table;
        this.values = values;
    }

    serialize(): Buffer {
        const builder: PacketBuilder = new PacketBuilder().string(this.database).string(this.table);
        builder.int(this.values.size);
        for(const entry of this.values.entries()) {
            builder.string(entry[0]);
            builder.string(entry[1]);
        }
        return builder.build();
    }
    getId(): number {
        return 18;
    }
}