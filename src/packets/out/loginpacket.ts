import { PacketBuilder } from "../../util/packetbuilder";
import { PacketReader } from "../../util/packetreader";
import { PacketOut } from "../packetout";

export class LoginPacket extends PacketOut {
    private username: string = "";
    private password: string = "";

    public constructor(username: string, password: string) {
        super();
        this.username = username;
        this.password = password;
    }
    
    serialize(): Buffer {
        return new PacketBuilder().string(this.username).string(this.password).build();
    }
    getId(): number {
        return 3;
    }
}