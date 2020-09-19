import { PacketBuilder } from "../../util/packetbuilder";
import { PacketOut } from "../packetout";

export class EncryptionEnabledPacket extends PacketOut {
    private readonly encryptionSecret: Buffer;

    public constructor(encryptionSecret: Buffer) {
        super();
        this.encryptionSecret = encryptionSecret;
    }

    serialize(): Buffer {
        return new PacketBuilder().int(this.encryptionSecret.length).buffer(this.encryptionSecret).build();
    }
    getId(): number {
        return 2;
    }
}