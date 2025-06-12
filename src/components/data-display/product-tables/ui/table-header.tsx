import { TableHead, TableRow } from "@/components/ui";
import {
	type Header,
	type HeaderGroup,
	flexRender,
} from "@tanstack/react-table";
import type * as React from "react";

import { cn } from "@/lib/utils";
import type { TableHeaderContentProps } from "../types";

export function TableHeaderContent<TData>({
	headerGroups,
	renderHeader,
	cellClassName,
}: TableHeaderContentProps<TData>) {
	return (
		<>
			{headerGroups.map((headerGroup: HeaderGroup<TData>) => (
				<TableRow key={headerGroup.id}>
					{headerGroup.headers.map((header: Header<TData, unknown>) => (
						<TableHead
							key={header.id}
							colSpan={header.colSpan}
							className={cn(cellClassName)}
						>
							{renderHeader
								? renderHeader(header)
								: header.isPlaceholder
									? null
									: flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
						</TableHead>
					))}
				</TableRow>
			))}
		</>
	);
}
