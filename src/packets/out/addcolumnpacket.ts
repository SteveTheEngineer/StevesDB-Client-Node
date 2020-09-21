import { TableColumnType } from "../../database/tablecolumntype";
import { PacketBuilder } from "../../util/packetbuilder";
import { PacketOut } from "../packetout";

export class AddColumnPacket extends PacketOut {
    private readonly database: string;
    private readonly table: string;
    private readonly type: TableColumnType;
    private readonly name: string;

    public constructor(database: string, table: string, type: TableColumnType, name: string) {
        super();
        this.database = database;
        this.table = table;
        this.type = type;
        this.name = name;
    }

    serialize(): Buffer {
        return new PacketBuilder().string(this.database).string(this.table).unsignedByte(this.type).string(this.name).build();
    }
    getId(): number {
        return 14;
    }
}