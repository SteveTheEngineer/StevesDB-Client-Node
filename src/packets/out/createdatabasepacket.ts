import { PacketBuilder } from "../../util/packetbuilder";
import { PacketOut } from "../packetout";

export class CreateDatabasePacket extends PacketOut {
    private readonly name: string;

    public constructor(name: string) {
        super();
        this.name = name;
    }

    serialize(): Buffer {
        return new PacketBuilder().string(this.name).build();
    }
    getId(): number {
        return 7;
    }
}