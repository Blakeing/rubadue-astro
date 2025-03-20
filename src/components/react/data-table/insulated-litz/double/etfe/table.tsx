import { DataTable } from "@/components/react/data-table/components/data-table";
import { columns } from "./columns";
import { doubleInsulatedLitzData } from "./data";

export function DoubleInsulatedLitzTable() {
	return (
		<div className="not-prose">
			<DataTable
				columns={columns}
				data={doubleInsulatedLitzData}
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
