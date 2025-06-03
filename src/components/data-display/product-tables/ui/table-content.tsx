import { TableCell, TableRow } from "@/components/ui";
import { type Row, flexRender } from "@tanstack/react-table";
import * as React from "react";

import type { TableContentProps } from "@/components/data-display/product-tables/types";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";

/**
 * Props for the TableRowMemo component
 */
interface TableRowMemoProps<TData> {
	row: Row<TData>;
	index: number;
	rowClassName?: string;
	cellClassName?: string;
	onRowClick?: (row: Row<TData>) => void;
	isRowSelected?: (row: Row<TData>) => boolean;
	renderCell?: (row: Row<TData>, index: number) => React.ReactNode;
}

/**
 * Memoized table row component for better performance
 */
function TableRowComponent<TData extends object>({
	row,
	index,
	rowClassName,
	cellClassName,
	onRowClick,
	isRowSelected,
	renderCell,
}: TableRowMemoProps<TData>) {
	// Memoize row click handler
	const handleRowClick = React.useCallback(() => {
		onRowClick?.(row);
	}, [onRowClick, row]);

	// Memoize row selection state
	const selected = React.useMemo(
		() => isRowSelected?.(row),
		[isRowSelected, row],
	);

	return (
		<TableRow
			key={row.id}
			className={cn(
				rowClassName,
				onRowClick && "cursor-pointer hover:bg-muted/50",
				selected && "bg-muted",
			)}
			onClick={onRowClick ? handleRowClick : undefined}
			data-state={selected ? "selected" : ""}
			aria-selected={selected}
		>
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id} className={cn(cellClassName)}>
					{renderCell
						? renderCell(row, index)
						: flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
		</TableRow>
	);
}

const TableRowMemo = React.memo(
	TableRowComponent,
) as typeof TableRowComponent & {
	displayName?: string;
};

TableRowMemo.displayName = "TableRowMemo";

/**
 * Message row component for loading, error, and empty states
 */
const MessageRow = React.memo(
	({
		message,
		columns,
		className,
	}: {
		message: string;
		columns: number;
		className?: string;
	}) => (
		<TableRow>
			<TableCell
				colSpan={columns}
				className={cn("h-24 text-center", className)}
			>
				{message}
			</TableCell>
		</TableRow>
	),
);

MessageRow.displayName = "MessageRow";

/**
 * Enhanced table content component with virtualization support and performance optimizations
 */
export function TableContent<TData extends object>({
	rows,
	columns,
	isLoading,
	error,
	emptyMessage = "No results.",
	errorMessage = "An error occurred while loading the data.",
	loadingMessage = "Loading data...",
	rowClassName,
	cellClassName,
	onRowClick,
	isRowSelected,
	renderCell,
	enableVirtualization = false,
	estimateSize = 48,
	overscan = 5,
}: TableContentProps<TData>) {
	// Handle loading, error, and empty states
	if (isLoading) {
		return <MessageRow message={loadingMessage} columns={columns} />;
	}

	if (error) {
		return (
			<MessageRow
				message={errorMessage}
				columns={columns}
				className="text-destructive"
			/>
		);
	}

	if (rows.length === 0) {
		return <MessageRow message={emptyMessage} columns={columns} />;
	}

	// Set up virtualization if enabled
	const parentRef = React.useRef<HTMLTableSectionElement>(null);

	const rowVirtualizer = enableVirtualization
		? useVirtualizer({
				count: rows.length,
				getScrollElement: () => parentRef.current,
				estimateSize: () => estimateSize,
				overscan,
			})
		: null;

	// Render virtualized rows
	if (rowVirtualizer) {
		return (
			<>
				{/* Spacer to maintain scroll position */}
				<tr>
					<td style={{ height: `${rowVirtualizer.getTotalSize()}px` }} />
				</tr>
				{/* Virtualized rows */}
				{rowVirtualizer.getVirtualItems().map((virtualRow) => {
					const row = rows[virtualRow.index];
					return (
						<TableRowMemo<TData>
							key={row.id}
							row={row}
							index={virtualRow.index}
							rowClassName={rowClassName}
							cellClassName={cellClassName}
							onRowClick={onRowClick}
							isRowSelected={isRowSelected}
							renderCell={renderCell}
						/>
					);
				})}
			</>
		);
	}

	// Render all rows if virtualization is disabled
	return (
		<>
			{rows.map((row: Row<TData>, index: number) => (
				<TableRowMemo<TData>
					key={row.id}
					row={row}
					index={index}
					rowClassName={rowClassName}
					cellClassName={cellClassName}
					onRowClick={onRowClick}
					isRowSelected={isRowSelected}
					renderCell={renderCell}
				/>
			))}
		</>
	);
}
