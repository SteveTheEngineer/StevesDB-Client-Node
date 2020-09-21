import { PacketBuilder } from "../../util/packetbuilder";
import { PacketOut } from "../packetout";

export class HelloPacket extends PacketOut {
    private readonly protocolVersion: number;
    private readonly clientVersion: string;

    public constructor(protocolVersion: number, clientVersion: string) {
        super();
        this.protocolVersion = protocolVersion;
        this.clientVersion = clientVersion;
    }

    serialize(): Buffer {
        return new PacketBuilder().int(this.protocolVersion).string(this.clientVersion).build();
    }
    getId(): number {
        return 0;
    }
}