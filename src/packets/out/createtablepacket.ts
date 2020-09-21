import { PacketBuilder } from "../../util/packetbuilder";
import { PacketOut } from "../packetout";

export class CreateTablePacket extends PacketOut {
    private readonly database: string;
    private readonly name: string;

    public constructor(database: string, name: string) {
        super();
        this.database = database;
        this.name = name;
    }

    serialize(): Buffer {
        return new PacketBuilder().string(this.database).string(this.name).build();
    }
    getId(): number {
        return 10;
    }
}