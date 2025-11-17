import type { WireData } from "../types";
import { createWireColumns } from "../utils/create-wire-columns";
import { WireTable } from "./wire-table";

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
