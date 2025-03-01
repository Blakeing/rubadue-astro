"use client";

import { SimpleDataTable } from "@/components/react/data-table/simple-data-table";
import { columns } from "./columns";
import { wireData } from "./data";

export function DoubleInsulatedTable() {
	return (
		<div className="">
			<SimpleDataTable columns={columns} data={wireData} />
		</div>
	);
}
