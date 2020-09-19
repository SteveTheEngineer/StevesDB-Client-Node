import { RemoveColumnResponsePacket } from "../packets/in/removecolumnresponsepacket";
import { RemoveColumnPacket } from "../packets/out/removecolumnpacket";
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

    public getType(): TableColumnType {
        return this.type;
    }

    public getName(): string {
        return this.name;
    }

    public async exists(): Promise<boolean> {
        const columns: TableColumn[] | undefined = await this.parent?.getColumns();
        if(columns != undefined) {
            return columns.find(tc => tc.name === this.name) != undefined;
        } else {
            return false;
        }
    }

    public async remove(): Promise<boolean> {
        this.parent?.parent.parent.sendPacket(new RemoveColumnPacket(this.parent.parent.getName(), this.parent.getName(), this.name));
        const response: RemoveColumnResponsePacket | undefined = await this.parent?.parent.parent.waitForResponse(RemoveColumnResponsePacket);
        return response != undefined && response.isSuccessful();
    }
}