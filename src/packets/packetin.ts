import { PacketReader } from "../util/packetreader";

export abstract class PacketIn {
    abstract deserialize(reader: PacketReader): void;
}