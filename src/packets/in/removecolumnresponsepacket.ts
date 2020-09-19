import { PacketReader } from "../../util/packetreader";
import { PacketIn } from "../packetin";

export class RemoveColumnResponsePacket extends PacketIn {
    private success: boolean = false;

    public isSuccessful(): boolean {
        return this.success;
    }
    
    deserialize(reader: PacketReader): void {
        this.success = reader.boolean();
    }
}