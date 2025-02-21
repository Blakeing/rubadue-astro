import { DataTable } from "@/components/react/data-table/data-table";
import { columns } from "./columns";
import { wireData } from "./data";

export function PfaWireTable() {
	return <DataTable columns={columns} data={wireData} />;
}
