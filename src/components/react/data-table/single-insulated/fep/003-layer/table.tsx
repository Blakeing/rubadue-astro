import { DataTable } from "@/components/react/data-table";
import { columns } from "./columns";
import { wireData } from "./data";

export function SingleInsulatedFep003Table() {
	return <DataTable columns={columns} data={wireData} simple />;
}
