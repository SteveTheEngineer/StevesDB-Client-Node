import { PacketReader } from "../../util/packetreader";
import { PacketIn } from "../packetin";

export class ListDatabasesResponsePacket extends PacketIn {
    private success: boolean = false;
    private databases: string[] = [];

    public isSuccessful(): boolean {
        return this.success;
    }

    public getDatabases(): string[] {
        return this.databases;
    }

    deserialize(reader: PacketReader): void {
        this.success = reader.boolean();
        const length: number = reader.int();
        for(let i = 0; i < length; i++) {
            this.databases.push(reader.string());
        }
    }
}