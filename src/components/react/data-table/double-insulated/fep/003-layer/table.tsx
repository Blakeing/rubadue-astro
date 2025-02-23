import { SimpleDataTable } from "@/components/react/data-table/simple-data-table";
import { columns } from "./columns";
import { wireData } from "./data";
import type { WireData } from "./types";
import type { ColumnDef } from "@tanstack/react-table";

export function DoubleInsulatedTable() {
	return (
		<div className="container mx-auto py-10">
			<SimpleDataTable
				columns={columns as ColumnDef<WireData>[]}
				data={wireData}
			/>
		</div>
	);
}
