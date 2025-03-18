import { WireTable } from "@/components/react/data-table";
import { columns } from "./columns";
import { wireData } from "./data";

export function SingleInsulatedTable() {
	return (
		<WireTable
			columns={columns}
			data={wireData}
			simple
			pageSize={10}
			enableMultiSort={true}
			hideSearch={false}
			hidePagination={false}
		/>
	);
}
