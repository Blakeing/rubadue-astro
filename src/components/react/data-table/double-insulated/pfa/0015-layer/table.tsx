"use client";

import { DataTable } from "@/components/react/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { columns } from "./columns";
import { wireData } from "./data";
import type { WireData } from "./types";

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
