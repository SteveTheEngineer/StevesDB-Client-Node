import { TableColumn } from "../../database/tablecolumn";
import { TableColumnType } from "../../database/tablecolumntype";
import { PacketReader } from "../../util/packetreader";
import { PacketIn } from "../packetin";

export class ListColumnsResponsePacket extends PacketIn {
    private success: boolean = false;
    private columns: TableColumn[] = [];

    public isSuccessful(): boolean {
        return this.success;
    }

    public getColumns(): TableColumn[] {
        return this.columns;
    }
    
    deserialize(reader: PacketReader): void {
        this.success = reader.boolean();
        const length: number = reader.int();
        for (let i = 0; i < length; i++) {
            this.columns.push(new TableColumn(undefined, reader.unsignedByte() as TableColumnType, reader.string()));
        }
    }
}