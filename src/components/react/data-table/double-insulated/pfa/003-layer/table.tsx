import { columns } from "./columns";
import { wireData } from "./data";
import type { WireData } from "./types";
import type { ColumnDef } from "@tanstack/react-table";
import { SimpleDataTable } from "../../../simple-data-table";

export function DoubleInsulatedTable() {
	return (
		<div className="container mx-auto py-10">
			<SimpleDataTable
				columns={columns as ColumnDef<WireData, unknown>[]}
				data={wireData}
			/>
		</div>
	);
}
