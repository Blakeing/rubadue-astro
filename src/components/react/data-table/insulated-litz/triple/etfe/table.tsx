import { columns } from "./columns";
import { tripleInsulatedLitzData } from "./data";
import { DataTable } from "@/components/react/data-table/data-table";

export function TripleInsulatedLitzTable() {
	return (
		<DataTable
			columns={columns}
			data={tripleInsulatedLitzData}
			title="Triple ETFE Insulated Litz Wire Specifications"
		/>
	);
}
