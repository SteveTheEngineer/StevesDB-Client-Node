import { PacketReader } from "../../util/packetreader";
import { PacketIn } from "../packetin";

export class ListEntriesResponsePacket extends PacketIn {
    private success: boolean = false;
    private total: number = 0;
    private entries: string[][] = [];

    public isSuccessful(): boolean {
        return this.success;
    }

    public getEntries(): string[][] {
        return this.entries;
    }

    public getTotal(): number {
        return this.total;
    }

    deserialize(reader: PacketReader): void {
        this.success = reader.boolean();
        this.total = reader.int();
        const length: number = reader.int();
        for(let i = 0; i < length; i++) {
            if(this.entries[i] === undefined) {
                this.entries[i] = [];
            }
            const length2: number = reader.int();
            for(let i2 = 0; i2 < length2; i2++) {
                this.entries[i].push(reader.string());
            }
        }
    }
}