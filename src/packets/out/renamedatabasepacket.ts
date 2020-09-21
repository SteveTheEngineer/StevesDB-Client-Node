import { PacketBuilder } from "../../util/packetbuilder";
import { PacketOut } from "../packetout";

export class RenameDatabasePacket extends PacketOut {
    private readonly database: string;
    private readonly newName: string;

    public constructor(database: string, newName: string) {
        super();
        this.database = database;
        this.newName = newName;
    }

    serialize(): Buffer {
        return new PacketBuilder().string(this.database).string(this.newName).build();
    }
    getId(): number {
        return 9;
    }
}