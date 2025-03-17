import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { BaseTable } from "./base-table";

interface DataTableProps<TData extends object> {
	data: TData[];
	columns: ColumnDef<TData, unknown>[];
	title?: string;
	pageSize?: number;
	simple?: boolean;
}

export function DataTable<TData extends object>({
	data,
	columns,
	title,
	pageSize = 10,
	simple = false,
}: DataTableProps<TData>) {
	return (
		<BaseTable
			data={data}
			columns={columns}
			title={title}
			pageSize={pageSize}
			enableMultiSort={!simple}
		/>
	);
}
