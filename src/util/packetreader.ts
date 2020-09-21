export class PacketReader {
    private pos: number = 0;
    private readonly packet: Buffer;
    public constructor(packet: Buffer) {
        this.packet = packet;
    }

    public boolean(): boolean {
        this.pos++;
        return this.packet[this.pos - 1] === 0x01;
    }
    public byte(): number {
        this.pos++;
        return this.packet.readInt8(this.pos - 1);
    }
    public unsignedByte(): number {
        this.pos++;
        return this.packet.readUInt8(this.pos - 1);
    }
    public short(): number {
        this.pos += 2;
        return this.packet.readInt16BE(this.pos - 2);
    }
    public unsignedShort(): number {
        this.pos += 2;
        return this.packet.readUInt16BE(this.pos - 2);
    }
    public int(): number {
        this.pos += 4;
        return this.packet.readInt32BE(this.pos - 4);
    }
    public long(): bigint {
        this.pos += 8;
        return this.packet.readBigInt64BE(this.pos - 8);
    }
    public unsignedLong(): bigint {
        this.pos += 8;
        return this.packet.readBigUInt64BE(this.pos - 8);
    }
    public float(): number {
        this.pos += 4;
        return this.packet.readFloatBE(this.pos - 4);
    }
    public double(): number {
        this.pos += 8;
        return this.packet.readDoubleBE(this.pos - 8);
    }
    public string(): string {
        const length = this.int();
        this.pos += length;
        return this.packet.toString("utf8", this.pos - length, this.pos);
    }
    public byteArray(): number[] {
        const length = this.int();
        const array = [];
        for(let i = 0; i < length; i++) {
            array.push(this.byte());
        }
        return array;
    }
    public stringArray(): string[] {
        const length = this.int();
        const array = [];
        for(let i = 0; i < length; i++) {
            array.push(this.string());
        }
        return array;
    }
    public unsignedByteArray(): number[] {
        const length = this.int();
        const array = [];
        for(let i = 0; i < length; i++) {
            array.push(this.unsignedByte());
        }
        return array;
    }

    public available(): number {
        return this.packet.length - this.pos;
    }
}