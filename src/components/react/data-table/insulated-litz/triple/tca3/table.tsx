import { DataTable } from "@/components/react/data-table";
import { columns } from "./columns";
import { tripleInsulatedLitzData } from "./data";

export function TripleInsulatedLitzTable() {
	return (
		<DataTable
			columns={columns}
			data={tripleInsulatedLitzData}
			title="Triple TCA3 Insulated Litz Wire Specifications"
		/>
	);
}
