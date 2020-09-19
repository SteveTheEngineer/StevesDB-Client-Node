import { PacketBuilder } from "../../util/packetbuilder";
import { PacketOut } from "../packetout";

export class RenameTablePacket extends PacketOut {
    private readonly database: string;
    private readonly table: string;
    private readonly newName: string;

    public constructor(database: string, table: string, newName: string) {
        super();
        this.database = database;
        this.table = table;
        this.newName = newName;
    }

    serialize(): Buffer {
        return new PacketBuilder().string(this.database).string(this.table).string(this.newName).build();
    }
    getId(): number {
        return 11;
    }
}