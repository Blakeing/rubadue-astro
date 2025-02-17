import { columns } from "./columns";
import { doubleInsulatedLitzData } from "./data";
import { DataTable } from "@/components/react/data-table/data-table";

export function DoubleInsulatedLitzTable() {
	return (
		<DataTable
			columns={columns}
			data={doubleInsulatedLitzData}
			title="Double ETFE Insulated Litz Wire Specifications"
		/>
	);
}
