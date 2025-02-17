import { columns } from "./columns";
import { etfeWireData } from "./data";
import { DataTable } from "@/components/react/data-table/data-table";

export function EtfeWireTable() {
	return <DataTable columns={columns} data={etfeWireData} />;
}
