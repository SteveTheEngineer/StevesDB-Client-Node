import { AddColumnResponsePacket } from "../packets/in/addcolumnresponsepacket";
import { AddEntryResponsePacket } from "../packets/in/addentryresponsepacket";
import { CreateTableResponsePacket } from "../packets/in/createtableresponsepacket";
import { DeleteTableResponsePacket } from "../packets/in/deletetableresponsepacket";
import { ListColumnsResponsePacket } from "../packets/in/listcolumnsresponsepacket";
import { ListEntriesResponsePacket } from "../packets/in/listentriesresponsepacket";
import { ListTablesResponsePacket } from "../packets/in/listtablesresponsepacket";
import { ModifyEntryResponsePacket } from "../packets/in/modifyentryresponsepacket";
import { RemoveEntryResponsePacket } from "../packets/in/removeentryresponsepacket";
import { RenameTableResponsePacket } from "../packets/in/renametableresponsepacket";
import { AddColumnPacket } from "../packets/out/addcolumnpacket";
import { AddEntryPacket } from "../packets/out/addentrypacket";
import { CreateTablePacket } from "../packets/out/createtablepacket";
import { DeleteTablePacket } from "../packets/out/deletetablepacket";
import { ListColumnsPacket } from "../packets/out/listcolumnspacket";
import { ListEntriesPacket } from "../packets/out/listentriespacket";
import { ListTablesPacket } from "../packets/out/listtablespacket";
import { ModifyEntryPacket } from "../packets/out/modifyentrypacket";
import { RemoveEntryPacket } from "../packets/out/removeentrypacket";
import { RenameTablePacket } from "../packets/out/renametablepacket";
import { Database, EntryValuesModifier } from "../stevesdbclient";
import { EntryFilter } from "./entryfilter";
import { EntryValues } from "./entryvalues";
import { TableColumn } from "./tablecolumn";
import { TableColumnType } from "./tablecolumntype";

export class Table {
    readonly parent: Database;
    private name: string;

    public constructor(parent: Database, name: string) {
        this.parent = parent;
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public async getTotalEntries(filter: EntryFilter | undefined = undefined): Promise<number> {
        this.parent.parent.sendPacket(new ListEntriesPacket(this.parent.getName(), this.name, 0, 0, filter != undefined ? filter : {}));
        const response: ListEntriesResponsePacket = await this.parent.parent.waitForResponse(ListEntriesResponsePacket);
        if(response.isSuccessful()) {
            return response.getTotal();
        } else {
            return 0;
        }
    }

    public size(filter: EntryFilter | undefined = undefined): Promise<number> {
        return this.getTotalEntries(filter);
    }

    public async getEntries(filter: EntryFilter | undefined = undefined, start = -0x80000000, end = 0x7FFFFFFF): Promise<EntryValues[]> {
        this.parent.parent.sendPacket(new ListEntriesPacket(this.parent.getName(), this.name, start, end, filter != undefined ? filter : {}));
        const response: ListEntriesResponsePacket = await this.parent.parent.waitForResponse(ListEntriesResponsePacket);
        if(response.isSuccessful()) {
            const columns: TableColumn[] = await this.getColumns();
            const entries: string[][] = await response.getEntries();
            const nameKeyedEntries: EntryValues[] = [];
            for(const entry of entries) {
                const nameKeyedEntry: EntryValues = {};
                for(const cid in entry) {
                    const tc: TableColumn = columns[cid];
                    let value: string | number | boolean = entry[cid];
                    if(tc.getType() === TableColumnType.BOOLEAN) {
                        value = value === "true";
                    } else if(tc.getType() === TableColumnType.DOUBLE) {
                        value = parseFloat(value);
                    } else if(tc.getType() === TableColumnType.INTEGER || tc.getType() === TableColumnType.LONG) {
                        value = parseInt(value);
                    }
                    nameKeyedEntry[tc.getName()] = value;
                }
                nameKeyedEntries.push(nameKeyedEntry);
            }
            return nameKeyedEntries;
        } else {
            return [];
        }
    }

    public async getEntry(filter: EntryFilter | undefined = undefined, index = 0): Promise<EntryValues | undefined> {
        return (await this.getEntries(filter, index, index))[0];
    }

    public entries(filter: EntryFilter | undefined = undefined, start = -0x80000000, end = 0x7FFFFFFF): Promise<EntryValues[]> {
        return this.getEntries(filter, start, end);
    }

    public entry(filter: EntryFilter | undefined = undefined, index = 0): Promise<EntryValues | undefined> {
        return this.getEntry(filter, index);
    }

    public async addEntry(entry: EntryValues): Promise<boolean> {
        const values: Map<string, string> = new Map<string, string>();
        for(const pair of Object.entries(entry)) {
            values.set(pair[0], pair[1].toString());
        }
        this.parent.parent.sendPacket(new AddEntryPacket(this.parent.getName(), this.name, values));
        const response: AddEntryResponsePacket = await this.parent.parent.waitForResponse(AddEntryResponsePacket);
        return response.isSuccessful();
    }

    public add(entry: EntryValues): Promise<boolean> {
        return this.addEntry(entry);
    }

    public async removeEntries(filter: EntryFilter): Promise<boolean> {
        this.parent.parent.sendPacket(new RemoveEntryPacket(this.parent.getName(), this.name, filter));
        const response: RemoveEntryResponsePacket = await this.parent.parent.waitForResponse(RemoveEntryResponsePacket);
        return response.isSuccessful();
    }

    public remove(filter: EntryFilter): Promise<boolean> {
        return this.removeEntries(filter);
    }

    public async modifyEntries(filter: EntryFilter, values: EntryValuesModifier): Promise<boolean> {
        this.parent.parent.sendPacket(new ModifyEntryPacket(this.parent.getName(), this.name, filter, values));
        const response: ModifyEntryResponsePacket = await this.parent.parent.waitForResponse(ModifyEntryResponsePacket);
        return response.isSuccessful();
    }

    public modify(filter: EntryFilter, values: EntryValuesModifier): Promise<boolean> {
        return this.modifyEntries(filter, values);
    }

    public async getColumn(name: string): Promise<TableColumn | undefined> {
        return (await this.getColumns()).find(tc => tc.getName() === name);
    }

    public async addColumn(type: TableColumnType, name: string): Promise<TableColumn | undefined> {
        this.parent.parent.sendPacket(new AddColumnPacket(this.parent.getName(), this.name, type, name));
        const response: AddColumnResponsePacket = await this.parent.parent.waitForResponse(AddColumnResponsePacket);
        if(response.isSuccessful()) {
            return new TableColumn(this, type, name);
        } else {
            return undefined;
        }
    }

    public async getColumns(): Promise<TableColumn[]> {
        this.parent.parent.sendPacket(new ListColumnsPacket(this.parent.getName(), this.name));
        const response: ListColumnsResponsePacket = await this.parent.parent.waitForResponse(ListColumnsResponsePacket);
        if(response.isSuccessful()) {
            return response.getColumns().map(tc => new TableColumn(this, tc.getType(), tc.getName()));
        } else {
            return [];
        }
    }

    public async exists(): Promise<boolean> {
        this.parent.parent.sendPacket(new ListTablesPacket(this.parent.getName()));
        const response: ListTablesResponsePacket = await this.parent.parent.waitForResponse(ListTablesResponsePacket);
        if(response.isSuccessful()) {
            return response.getTables().includes(this.name);
        } else {
            return false;
        }
    }

    public async create(): Promise<boolean> {
        this.parent.parent.sendPacket(new CreateTablePacket(this.parent.getName(), this.name));
        const response: CreateTableResponsePacket = await this.parent.parent.waitForResponse(CreateTableResponsePacket);
        return response.isSuccessful();
    }

    public async delete(): Promise<boolean> {
        this.parent.parent.sendPacket(new DeleteTablePacket(this.parent.getName(), this.name));
        const response: DeleteTableResponsePacket = await this.parent.parent.waitForResponse(DeleteTableResponsePacket);
        return response.isSuccessful();
    }

    public async rename(newName: string): Promise<boolean> {
        this.parent.parent.sendPacket(new RenameTablePacket(this.parent.getName(), this.name, newName));
        const response: RenameTableResponsePacket = await this.parent.parent.waitForResponse(RenameTableResponsePacket);
        if(response.isSuccessful()) {
            this.name = newName;
            return true;
        } else {
            return false;
        }
    }
}