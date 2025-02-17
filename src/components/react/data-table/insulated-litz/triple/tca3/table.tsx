import { columns } from "./columns";
import { tripleInsulatedLitzData } from "./data";
import { DataTable } from "@/components/react/data-table/data-table";

export function TripleInsulatedLitzTable() {
	return (
		<DataTable
			columns={columns}
			data={tripleInsulatedLitzData}
			title="Triple TCA3 Insulated Litz Wire Specifications"
		/>
	);
}
