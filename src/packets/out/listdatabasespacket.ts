import { PacketOut } from "../packetout";

export class ListDatabasesPacket extends PacketOut {
    serialize(): Buffer {
        return Buffer.alloc(0);
    }
    getId(): number {
        return 5;
    }
}