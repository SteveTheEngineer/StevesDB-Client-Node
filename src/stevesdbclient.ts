import Net from "net";
import Crypto from "crypto";
import { PacketReader } from "./util/packetreader";
import { PacketBuilder } from "./util/packetbuilder";
import { PacketIn } from "./packets/packetin";
import { HelloResponsePacket } from "./packets/in/helloresponsepacket";
import { PacketOut } from "./packets/packetout";
import { EncryptionResponsePacket } from "./packets/in/encryptionresponsepacket";
import { HelloPacket } from "./packets/out/hellopacket";
import { EncryptionPacket } from "./packets/out/encryptionpacket";
import { EncryptionEnabledPacket } from "./packets/out/encryptionenabledpacket";
import { ListDatabasesResponsePacket } from "./packets/in/listdatabasesresponsepacket";
import { LoginResponsePacket } from "./packets/in/loginresponsepacket";
import { LoginPacket } from "./packets/out/loginpacket";
import { LogoutResponsePacket } from "./packets/in/logoutresponsepacket";
import { LogoutPacket } from "./packets/out/logoutpacket";
import { Database } from "./database/database";
import { ListDatabasesPacket } from "./packets/out/listdatabasespacket";
import { Table } from "./database/table";
import { ListTablesResponsePacket } from "./packets/in/listtablesresponsepacket";
import { CreateDatabaseResponsePacket } from "./packets/in/createdatabaseresponsepacket";
import { CreateTableResponsePacket } from "./packets/in/createtableresponsepacket";
import { DeleteDatabaseResponsePacket } from "./packets/in/deletedatabaseresponsepacket";
import { DeleteTableResponsePacket } from "./packets/in/deletetableresponsepacket";
import { RenameDatabaseResponsePacket } from "./packets/in/renamedatabaseresponsepacket";
import { RenameTableResponsePacket } from "./packets/in/renametableresponsepacket";
import { ListColumnsResponsePacket } from "./packets/in/listcolumnsresponsepacket";
import { ListColumnsPacket } from "./packets/out/listcolumnspacket";
import { TableColumnType } from "./database/tablecolumntype";
import { TableColumn } from "./database/tablecolumn";
import { CreateDatabasePacket } from "./packets/out/createdatabasepacket";
import { DeleteDatabasePacket } from "./packets/out/deletedatabasepacket";
import { CreateTablePacket } from "./packets/out/createtablepacket";
import { AddColumnResponsePacket } from "./packets/in/addcolumnresponsepacket";
import { AddColumnPacket } from "./packets/out/addcolumnpacket";
import { RenameColumnResponsePacket } from "./packets/in/renamecolumnresponsepacket";
import { RemoveColumnResponsePacket } from "./packets/in/removecolumnresponsepacket";
import { ListEntriesResponsePacket } from "./packets/in/listentriesresponsepacket";
import { ListEntriesPacket } from "./packets/out/listentriespacket";
import { ComparatorOperation } from "./database/comparatoroperation";
import { EntryFilter } from "./database/entryfilter";
import { AddEntryResponsePacket } from "./packets/in/addentryresponsepacket";
import { ModifyEntryResponsePacket } from "./packets/in/modifyentryresponsepacket";
import { RemoveEntryResponsePacket } from "./packets/in/removeentryresponsepacket";
import { EntryValuesModifier } from "./database/entryvaluesmodifier";
import { EntryValueOperation } from "./database/entryvalueoperation";

export class StevesDBClient {
    public static readonly PROTOCOL_VERSION: number = 2;
    public static readonly CLIENT_VERSION: string = require("../package.json").version;

    private connected: boolean = false;
    private connection: Net.Socket | undefined;
    private serverProtocol: number | undefined;
    private serverVersion: string | undefined;
    private username: string | undefined;

    private inPackets: {[id: number]: new() => PacketIn} = {
        0: HelloResponsePacket,
        1: EncryptionResponsePacket,
        2: LoginResponsePacket,
        3: LogoutResponsePacket,
        4: ListDatabasesResponsePacket,
        5: ListTablesResponsePacket,
        6: CreateDatabaseResponsePacket,
        7: CreateTableResponsePacket,
        8: DeleteDatabaseResponsePacket,
        9: DeleteTableResponsePacket,
        10: RenameDatabaseResponsePacket,
        11: RenameTableResponsePacket,
        12: ListColumnsResponsePacket,
        13: AddColumnResponsePacket,
        14: RenameColumnResponsePacket,
        15: RemoveColumnResponsePacket,
        16: ListEntriesResponsePacket,
        17: AddEntryResponsePacket,
        18: ModifyEntryResponsePacket,
        19: RemoveEntryResponsePacket
    };
    private packetWaiters: {packet: new() => PacketIn, handler: (inp: PacketIn) => void}[] = [];

    private sharedSecret: Buffer | undefined;

    public constructor() {
        
    }
    public connect(host: string, port = 2540, options = {encryption: true}): Promise<void> {
        return new Promise(((resolve, reject) => {
            if(this.connected) {
                reject("A connection has already been established");
                return;
            }
            this.connection = Net.createConnection(port, host);
            this.connection.on("error", err => {
                if(this.connection) {
                    this.connection.removeAllListeners();
                }
                reject("Connection refused");
            });
            this.connection.on("connect", async () => {
                if(this.connection) {
                    this.connection.removeAllListeners();
                    this.connection.on("data", data => {
                        this.handleData(data);
                    });
                    this.sendPacket(new HelloPacket(StevesDBClient.PROTOCOL_VERSION, StevesDBClient.CLIENT_VERSION));
                    this.waitForResponse(HelloResponsePacket).then(helloResponse => {
                        this.serverProtocol = helloResponse.getProtocolVersion();
                        this.serverVersion = helloResponse.getServerVersion();
                        if(this.serverProtocol === StevesDBClient.PROTOCOL_VERSION) {
                            if(options.encryption) {
                                this.sendPacket(new EncryptionPacket());
                                this.waitForResponse(EncryptionResponsePacket).then(encryptionResponse => {
                                    const sharedSecret: Buffer = Crypto.randomBytes(16);
                                    this.sendPacket(new EncryptionEnabledPacket(Crypto.publicEncrypt({key: Crypto.createPublicKey({key: encryptionResponse.getPublicKey(), format: "der", type: "spki"}), padding: Crypto.constants.RSA_PKCS1_PADDING}, sharedSecret)));
                                    this.sharedSecret = sharedSecret;
                                    resolve();
                                });
                            } else {
                                resolve();
                            }
                        } else {
                            reject("Incompatible protocol versions");
                        }
                    });
                }
            });
        }));
    }

    public async login(username: string, password: string): Promise<boolean> {
        this.sendPacket(new LoginPacket(username, password));
        const success: boolean = (await this.waitForResponse(LoginResponsePacket)).isSuccessful();
        if(success) {
            this.username = username;
        }
        return success;
    }
    public async logout(): Promise<boolean> {
        this.sendPacket(new LogoutPacket());
        const success: boolean = (await this.waitForResponse(LogoutResponsePacket)).isSuccessful();
        if(success) {
            this.username = undefined;
        }
        return success;
    }
    public getUsername(): string | undefined {
        return this.username;
    }
    public isLoggedIn(): boolean {
        return this.username != undefined;
    }

    public async getDatabases(): Promise<Database[]> {
        this.sendPacket(new ListDatabasesPacket());
        const response: ListDatabasesResponsePacket = await this.waitForResponse(ListDatabasesResponsePacket);
        if(response.isSuccessful()) {
            return response.getDatabases().map(name => new Database(this, name));
        } else {
            return [];
        }
    }
    public async getDatabaseIfExists(name: string): Promise<Database | undefined> {
        const database: Database = this.getDatabase(name);
        if(await database.exists()) {
            return database;
        } else {
            return undefined;
        }
    }
    public getDatabase(name: string): Database {
        return new Database(this, name);
    }
    public database(name: string): Database {
        return this.getDatabase(name);
    }

    sendPacket(packet: PacketOut): void {
        let buffer: Buffer = new PacketBuilder().int(packet.getId()).buffer(packet.serialize()).build();
        if(this.sharedSecret != undefined) {
            buffer = Crypto.createCipheriv("aes-128-cfb8", this.sharedSecret, this.sharedSecret).update(buffer);
        }
        buffer = new PacketBuilder().int(buffer.length).buffer(buffer).build();
        this.connection?.write(buffer);
    }
    waitForResponse<T extends PacketIn>(packet: new() => T): Promise<T> {
        return new Promise((resolve, reject) => {
            this.packetWaiters.push({
                packet,
                handler: (inp: PacketIn) => {
                    resolve(inp as T);
                }
            });
        });
    }

    private handleData(data: Buffer): void {
        const reader: PacketReader = new PacketReader(data);
        while(reader.available() > 0) {
            const length: number = reader.int();
            let packetData: Buffer = Buffer.alloc(length);
            for(let i = 0; i < length; i++) {
                packetData[i] = reader.unsignedByte();
            }
            if(this.sharedSecret != undefined) {
                packetData = Crypto.createDecipheriv("aes-128-cfb8", this.sharedSecret, this.sharedSecret).update(packetData);
            }
            const packetReader: PacketReader = new PacketReader(packetData);
            const id: number = packetReader.int();
            if(this.inPackets[id] != undefined) {
                const packetInType: new() => PacketIn = this.inPackets[id];
                const packetIn: PacketIn = new packetInType();
                packetIn.deserialize(packetReader);
                for(const index in this.packetWaiters) {
                    const waiter = this.packetWaiters[index];
                    if(waiter != undefined && packetInType === waiter.packet) {
                        waiter.handler(packetIn);
                        delete this.packetWaiters[index];
                        break;
                    }
                }
            }
        }
    }
}
export {
    Database,
    Table,
    TableColumn,
    TableColumnType,
    EntryFilter,
    ComparatorOperation,
    EntryValuesModifier,
    EntryValueOperation
};