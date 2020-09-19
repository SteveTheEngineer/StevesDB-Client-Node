import { PacketBuilder } from "../../util/packetbuilder";
import { PacketOut } from "../packetout";

export class DeleteDatabasePacket extends PacketOut {
    private readonly database: string;

    public constructor(database: string) {
        super();
        this.database = database;
    }

    serialize(): Buffer {
        return new PacketBuilder().string(this.database).build();
    }
    getId(): number {
        return 8;
    }
}