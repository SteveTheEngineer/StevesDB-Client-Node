import { PacketBuilder } from "../../util/packetbuilder";
import { PacketOut } from "../packetout";

export class RemoveColumnPacket extends PacketOut {
    private readonly database: string;
    private readonly table: string;
    private readonly column: string;

    public constructor(database: string, table: string, column: string) {
        super();
        this.database = database;
        this.table = table;
        this.column = column;
    }

    serialize(): Buffer {
        return new PacketBuilder().string(this.database).string(this.table).string(this.column).build();
    }
    getId(): number {
        return 16;
    }
}