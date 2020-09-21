import { PacketOut } from "../packetout";

export class EncryptionPacket extends PacketOut {
    serialize(): Buffer {
        return Buffer.alloc(0);
    }
    getId(): number {
        return 1;
    }

}