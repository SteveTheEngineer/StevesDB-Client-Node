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

    /**
     * Get the list of tables in the database
     * @returns the list of the tables
     */
    public async getTables(): Promise<Table[]> {
        this.parent.sendPacket(new ListTablesPacket(this.name));
        const response: ListTablesResponsePacket = await this.parent.waitForResponse(ListTablesResponsePacket);
        if(response.isSuccessful()) {
            return response.getTables().map(name => new Table(this, name));
        } else {
            return [];
        }
    }

    /**
     * Get the table by it's name if it exists, undefined otherwise
     * @param name table name
     * @returns the table if it exists, undefined otherwise
     */
    public async getTableIfExists(name: string): Promise<Table | undefined> {
        const table: Table = this.getTable(name);
        if(await table.exists()) {
            return table;
        } else {
            return undefined;
        }
    }

    /**
     * Get the table by it's name
     * @param name table name
     * @returns the table
     */
    public getTable(name: string): Table {
        return new Table(this, name);
    }

    /**
     * Alias for {@link getTable}
     * @param name table name
     * @returns the table
     */
    public table(name: string): Table {
        return this.getTable(name);
    }

    /**
     * Check whether does the database exist
     * @returns true, if the databse does exist
     */
    public async exists(): Promise<boolean> {
        this.parent.sendPacket(new ListDatabasesPacket());
        const response: ListDatabasesResponsePacket = await this.parent.waitForResponse(ListDatabasesResponsePacket);
        if(response.isSuccessful()) {
            return response.getDatabases().includes(this.name);
        } else {
            return false;
        }
    }

    /**
     * Create the database
     * @returns true, if the database was successfuly created
     */
    public async create(): Promise<boolean> {
        this.parent.sendPacket(new CreateDatabasePacket(this.name));
        const response: CreateDatabaseResponsePacket = await this.parent.waitForResponse(CreateDatabaseResponsePacket);
        return response.isSuccessful();
    }

    /**
     * Delete the database
     * @returns true, if the database was sucessfuly deleted
     */
    public async delete(): Promise<boolean> {
        this.parent.sendPacket(new DeleteDatabasePacket(this.name));
        const response: DeleteDatabaseResponsePacket = await this.parent.waitForResponse(DeleteDatabaseResponsePacket);
        return response.isSuccessful();
    }

    /**
     * Rename the database
     * @param newName the new name of the database
     * @returns true, if the database was sucessfuly renamed
     */
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

    /**
     * Get the database name
     * @returns the database name
     */
    public getName(): string {
        return this.name;
    }
}