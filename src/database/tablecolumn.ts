import { RemoveColumnResponsePacket } from "../packets/in/removecolumnresponsepacket";
import { RenameColumnResponsePacket } from "../packets/in/renamecolumnresponsepacket";
import { RemoveColumnPacket } from "../packets/out/removecolumnpacket";
import { RenameColumnPacket } from "../packets/out/renamecolumnpacket";
import { Table } from "../stevesdbclient";
import { TableColumnType } from "./tablecolumntype";

export class TableColumn {
    private readonly parent: Table | undefined;
    private readonly type: TableColumnType;
    private readonly name: string;

    public constructor(parent: Table | undefined, type: TableColumnType, name: string) {
        this.parent = parent;
        this.type = type;
        this.name = name;
    }

    /**
     * Get the table column
     * @returns the table column
     */
    public getType(): TableColumnType {
        return this.type;
    }

    /**
     * Get the table name
     * @returns the table name
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Rename the column
     * @param newName new table name
     * @returns true, if the column was succesfuly renamed
     */
    public async rename(newName: string): Promise<boolean> {
        this.parent?.parent.parent.sendPacket(new RenameColumnPacket(this.parent.parent.getName(), this.parent.getName(), this.name, newName));
        const response: RenameColumnResponsePacket | undefined = await this.parent?.parent.parent.waitForResponse(RenameColumnResponsePacket);
        return response != undefined && response.isSuccessful();
    }

    /**
     * Remove the column from the table
     * @returns true, if the column was succesfuly removed
     */
    public async remove(): Promise<boolean> {
        this.parent?.parent.parent.sendPacket(new RemoveColumnPacket(this.parent.parent.getName(), this.parent.getName(), this.name));
        const response: RemoveColumnResponsePacket | undefined = await this.parent?.parent.parent.waitForResponse(RemoveColumnResponsePacket);
        return response != undefined && response.isSuccessful();
    }

    /**
     * Check whether does the column exist
     * @returns true, if the column exists
     */
    public async exists(): Promise<boolean> {
        const columns: TableColumn[] | undefined = await this.parent?.getColumns();
        if(columns != undefined) {
            return columns.find(tc => tc.name === this.name) != undefined;
        } else {
            return false;
        }
    }
}