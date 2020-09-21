import { PacketOut } from "../packetout";

export class LogoutPacket extends PacketOut {
    serialize(): Buffer {
        return Buffer.alloc(0);
    }
    getId(): number {
        return 4;
    }

}