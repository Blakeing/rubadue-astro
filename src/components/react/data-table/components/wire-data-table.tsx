import { WireTable } from "./wire-table";
import { createWireColumns } from "../utils/create-wire-columns";
import type { WireData } from "../types";

interface WireDataTableProps {
	data: WireData[];
	displayName?: string;
	pageSize?: number;
	enableMultiSort?: boolean;
	hideSearch?: boolean;
	hidePagination?: boolean;
}

export function WireDataTable({
	data,
	displayName = "Wire Data",
	pageSize = 10,
	enableMultiSort = true,
	hideSearch = false,
	hidePagination = false,
}: WireDataTableProps) {
	const columns = createWireColumns<WireData>();

	return (
		<WireTable
			columns={columns}
			data={data}
			simple
			pageSize={pageSize}
			enableMultiSort={enableMultiSort}
			hideSearch={hideSearch}
			hidePagination={hidePagination}
		/>
	);
}
