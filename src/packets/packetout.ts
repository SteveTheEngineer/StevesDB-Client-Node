export abstract class PacketOut {
    abstract serialize(): Buffer;
    abstract getId(): number;
}