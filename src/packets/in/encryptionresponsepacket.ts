import { PacketReader } from "../../util/packetreader";
import { PacketIn } from "../packetin";

export class EncryptionResponsePacket extends PacketIn {
    private publicKey: Buffer = Buffer.alloc(0);

    public getPublicKey(): Buffer {
        return this.publicKey;
    }

    deserialize(reader: PacketReader): void {
        this.publicKey = Buffer.from(reader.unsignedByteArray());
    }
}