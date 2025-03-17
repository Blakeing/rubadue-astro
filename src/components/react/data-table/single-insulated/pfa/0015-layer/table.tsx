import { DataTable } from "@/components/react/data-table";
import { columns } from "./columns";
import { wireData } from "./data";

export function SingleInsulatedPfa0015Table() {
	return <DataTable columns={columns} data={wireData} simple />;
}
