import { PacketBuilder } from "../../util/packetbuilder";
import { PacketOut } from "../packetout";

export class RenameColumnPacket extends PacketOut {
    private readonly database: string;
    private readonly table: string;
    private readonly column: string;
    private readonly newName: string;

    public constructor(database: string, table: string, column: string, newName: string) {
        super();
        this.database = database;
        this.table = table;
        this.column = column;
        this.newName = newName;
    }

    serialize(): Buffer {
        return new PacketBuilder().string(this.database).string(this.table).string(this.column).string(this.newName).build();
    }
    getId(): number {
        return 15;
    }
}