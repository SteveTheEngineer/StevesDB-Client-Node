export class PacketBuilder {
    private chunks: Buffer[] = [];
    public constructor() {

    }

    public boolean(value: boolean): PacketBuilder {
        this.chunks.push(Buffer.of(value ? 0x01 : 0x00));
        return this;
    }
    public byte(value: number): PacketBuilder {
        const chunk = Buffer.alloc(1);
        chunk.writeInt8(value, 0);
        this.chunks.push(chunk);
        return this;
    }
    public unsignedByte(value: number): PacketBuilder {
        const chunk = Buffer.alloc(1);
        chunk.writeUInt8(value, 0);
        this.chunks.push(chunk);
        return this;
    }
    public short(value: number): PacketBuilder {
        const chunk = Buffer.alloc(2);
        chunk.writeInt16BE(value, 0);
        this.chunks.push(chunk);
        return this;
    }
    public unsignedShort(value: number): PacketBuilder {
        const chunk = Buffer.alloc(2);
        chunk.writeUInt16BE(value, 0);
        this.chunks.push(chunk);
        return this;
    }
    public int(value: number): PacketBuilder {
        const chunk = Buffer.alloc(4);
        chunk.writeInt32BE(value, 0);
        this.chunks.push(chunk);
        return this;
    }
    public long(value: bigint): PacketBuilder {
        const chunk = Buffer.alloc(8);
        chunk.writeBigInt64BE(value);
        this.chunks.push(chunk);
        return this;
    }
    public float(value: number): PacketBuilder {
        const chunk = Buffer.alloc(4);
        chunk.writeFloatBE(value, 0);
        this.chunks.push(chunk);
        return this;
    }
    public double(value: number): PacketBuilder {
        const chunk = Buffer.alloc(8);
        chunk.writeDoubleBE(value, 0);
        this.chunks.push(chunk);
        return this;
    }
    public string(value: string): PacketBuilder {
        const stringBuffer = Buffer.from(value, "utf8");
        this.int(stringBuffer.length);
        this.chunks.push(stringBuffer);
        return this;
    }
    public bytes(bytes: number[]): PacketBuilder {
        for(const byte of bytes) {
            this.byte(byte);
        }
        return this;
    }
    public unsignedBytes(bytes: number[]): PacketBuilder {
        for(const byte of bytes) {
            this.unsignedByte(byte);
        }
        return this;
    }
    public byteArray(array: number[]): PacketBuilder {
        this.int(array.length);
        this.bytes(array);
        return this;
    }
    public stringArray(array: string[]): PacketBuilder {
        this.int(array.length);
        for(const string of array) {
            this.string(string);
        }
        return this;
    }
    public unsignedByteArray(array: number[]): PacketBuilder {
        this.int(array.length);
        this.unsignedBytes(array);
        return this;
    }
    public buffer(buffer: Buffer): PacketBuilder {
        this.chunks.push(buffer);
        return this;
    }

    public build(): Buffer {
        return Buffer.concat(this.chunks);
    }
};