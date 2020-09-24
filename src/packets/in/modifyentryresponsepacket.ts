import { PacketReader } from "../../util/packetreader";
import { PacketIn } from "../packetin";

export class ModifyEntryResponsePacket extends PacketIn {
    private success: boolean = false;
    private modified: number = 0;

    public isSuccessful(): boolean {
        return this.success;
    }

    public getModifiedAmount(): number {
        return this.modified;
    }

    deserialize(reader: PacketReader): void {
        this.success = reader.boolean();
        this.modified = reader.int();
    }
}