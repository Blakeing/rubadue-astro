import { DataTable } from "@/components/react/data-table/components/data-table";
import { columns } from "./columns";
import { singleInsulatedLitzData } from "./data";

export function SingleInsulatedLitzTable() {
	return (
		<div className="not-prose">
			<DataTable
				columns={columns}
				data={singleInsulatedLitzData}
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
