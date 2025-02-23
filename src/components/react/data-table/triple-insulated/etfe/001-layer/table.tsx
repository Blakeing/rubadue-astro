import { SimpleDataTable } from "@/components/react/data-table/simple-data-table";
import { columns } from "./columns";
import { wireData } from "./data";

export function EtfeWireTable() {
	return <SimpleDataTable columns={columns} data={wireData} />;
}
