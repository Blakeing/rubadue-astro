import { TableHead, TableRow } from "@/components/react/ui";
import { flexRender } from "@tanstack/react-table";
import type * as React from "react";

import { cn } from "@/lib/utils";
import type { TableHeaderContentProps } from "./types";

export function TableHeaderContent<TData>({
	headerGroups,
	renderHeader,
	cellClassName,
}: TableHeaderContentProps<TData>) {
	return (
		<>
			{headerGroups.map((headerGroup) => (
				<TableRow key={headerGroup.id}>
					{headerGroup.headers.map((header) => (
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
