import { DataTable } from "@/components/react/data-table";
import { columns } from "./columns";
import { wireData } from "./data";

export function DoubleInsulatedTable() {
	return (
		<div className="">
			<DataTable columns={columns} data={wireData} simple />
		</div>
	);
}
