import { columns } from "./columns";
import { wireData } from "./data";
import { DataTable } from "@/components/react/data-table/data-table";

export function SingleInsulatedPfa003Table() {
	return <DataTable columns={columns} data={wireData} simple />;
}
