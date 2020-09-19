import { PacketBuilder } from "../../util/packetbuilder";
import { PacketOut } from "../packetout";

export class DeleteTablePacket extends PacketOut {
    private readonly database: string;
    private readonly table: string;

    public constructor(database: string, table: string) {
        super();
        this.database = database;
        this.table = table;
    }

    serialize(): Buffer {
        return new PacketBuilder().string(this.database).string(this.table).build();
    }
    getId(): number {
        return 12;
    }
}