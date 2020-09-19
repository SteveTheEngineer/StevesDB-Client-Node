import { PacketReader } from "../../util/packetreader";
import { PacketIn } from "../packetin";

export class ListTablesResponsePacket extends PacketIn {
    private success: boolean = false;
    private tables: string[] = [];

    public isSuccessful(): boolean {
        return this.success;
    }

    public getTables(): string[] {
        return this.tables;
    }

    deserialize(reader: PacketReader): void {
        this.success = reader.boolean();
        const length: number = reader.int();
        for(let i = 0; i < length; i++) {
            this.tables.push(reader.string());
        }
    }
}