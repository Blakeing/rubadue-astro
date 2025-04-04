import { DataTable } from "@/components/react/data-table/components/data-table";
import { columns } from "./columns";
import { tripleInsulatedLitzData } from "./data";

export function TripleInsulatedLitzTable() {
	return (
		<div className="not-prose">
			<DataTable
				columns={columns}
				data={tripleInsulatedLitzData}
				title="Wire Specifications"
				simple
				pageSize={10}
				enableMultiSort={true}
				hideSearch={false}
				hidePagination={false}
			/>
		</div>
	);
}
