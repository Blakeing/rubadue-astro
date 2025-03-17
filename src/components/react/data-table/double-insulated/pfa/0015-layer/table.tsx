"use client";

import { DataTable } from "@/components/react/data-table/data-table";
import { columns } from "./columns";
import { wireData } from "./data";
import type { WireData } from "./types";
import type { ColumnDef } from "@tanstack/react-table";

export function DoubleInsulatedTable() {
	return (
		<div className="">
			<DataTable
				columns={columns as ColumnDef<WireData>[]}
				data={wireData}
				simple
			/>
		</div>
	);
}
