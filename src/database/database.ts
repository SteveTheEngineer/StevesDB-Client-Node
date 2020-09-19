import { CreateDatabaseResponsePacket } from "../packets/in/createdatabaseresponsepacket";
import { DeleteDatabaseResponsePacket } from "../packets/in/deletedatabaseresponsepacket";
import { ListDatabasesResponsePacket } from "../packets/in/listdatabasesresponsepacket";
import { ListTablesResponsePacket } from "../packets/in/listtablesresponsepacket";
import { RenameDatabaseResponsePacket } from "../packets/in/renamedatabaseresponsepacket";
import { CreateDatabasePacket } from "../packets/out/createdatabasepacket";
import { DeleteDatabasePacket } from "../packets/out/deletedatabasepacket";
import { ListDatabasesPacket } from "../packets/out/listdatabasespacket";
import { ListTablesPacket } from "../packets/out/listtablespacket";
import { RenameDatabasePacket } from "../packets/out/renamedatabasepacket";
import { StevesDBClient, Table } from "../stevesdbclient";

export class Database {
    readonly parent: StevesDBClient;
    private name: string;

    public constructor(parent: StevesDBClient, name: string) {
        this.parent = parent;
        this.name = name;
    }

    public async getTables(): Promise<Table[]> {
        this.parent.sendPacket(new ListTablesPacket(this.name));
        const response: ListTablesResponsePacket = await this.parent.waitForResponse(ListTablesResponsePacket);
        if(response.isSuccessful()) {
            return response.getTables().map(name => new Table(this, name));
        } else {
            return [];
        }
    }
    public async getTableIfExists(name: string): Promise<Table | undefined> {
        const table: Table = this.getTable(name);
        if(await table.exists()) {
            return table;
        } else {
            return undefined;
        }
    }
    public getTable(name: string): Table {
        return new Table(this, name);
    }
    public table(name: string): Table {
        return this.getTable(name);
    }

    public async exists(): Promise<boolean> {
        this.parent.sendPacket(new ListDatabasesPacket());
        const response: ListDatabasesResponsePacket = await this.parent.waitForResponse(ListDatabasesResponsePacket);
        if(response.isSuccessful()) {
            return response.getDatabases().includes(this.name);
        } else {
            return false;
        }
    }

    public async create(): Promise<boolean> {
        this.parent.sendPacket(new CreateDatabasePacket(this.name));
        const response: CreateDatabaseResponsePacket = await this.parent.waitForResponse(CreateDatabaseResponsePacket);
        return response.isSuccessful();
    }

    public async delete(): Promise<boolean> {
        this.parent.sendPacket(new DeleteDatabasePacket(this.name));
        const response: DeleteDatabaseResponsePacket = await this.parent.waitForResponse(DeleteDatabaseResponsePacket);
        return response.isSuccessful();
    }

    public async rename(newName: string): Promise<boolean> {
        this.parent.sendPacket(new RenameDatabasePacket(this.name, newName));
        const response: RenameDatabaseResponsePacket = await this.parent.waitForResponse(RenameDatabaseResponsePacket);
        if(response.isSuccessful()) {
            this.name = newName;
            return true;
        } else {
            return false;
        }
    }

    public getName(): string {
        return this.name;
    }
}