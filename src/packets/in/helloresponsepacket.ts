import { PacketReader } from "../../util/packetreader";
import { PacketIn } from "../packetin";

export class HelloResponsePacket extends PacketIn {
    private protocolVersion: number = 0;
    private serverVersion: string = "";

    public getProtocolVersion(): number {
        return this.protocolVersion;
    }
    public getServerVersion(): string {
        return this.serverVersion;
    }

    deserialize(reader: PacketReader): void {
        this.protocolVersion = reader.int();
        this.serverVersion = reader.string();
    }
}