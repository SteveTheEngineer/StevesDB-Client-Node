import { PacketReader } from "../../util/packetreader";
import { PacketIn } from "../packetin";

export class RemoveEntryResponsePacket extends PacketIn {
    private success: boolean = false;
    private removed: number = 0;

    public isSuccessful(): boolean {
        return this.success;
    }

    public getRemovedAmount(): number {
        return this.removed;
    }
    
    deserialize(reader: PacketReader): void {
        this.success = reader.boolean();
        this.removed = reader.int();
    }
}