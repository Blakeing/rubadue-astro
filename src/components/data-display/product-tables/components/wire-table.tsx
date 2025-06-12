import { cn } from "@/lib/utils";
import type { ColumnDef, Header, Row } from "@tanstack/react-table";
import type * as React from "react";
import type { WireData } from "../types";
import { DataTable } from "./data-table";

interface BaseWireTableProps<TData extends object> {
	/** The data to display in the table */
	data: TData[];
	/** The column definitions for the table */
	columns: ColumnDef<TData, unknown>[];
	/** The title to display above the table */
	title?: string;
	/** Whether to use a simple table layout */
	simple?: boolean;
	/** The number of rows per page */
	pageSize?: number;
	/** Additional class name for the table container */
	className?: string;
	/** Whether to enable multi-column sorting */
	enableMultiSort?: boolean;
	/** Whether to hide the search input */
	hideSearch?: boolean;
	/** Whether to hide the pagination */
	hidePagination?: boolean;
	/** Whether to show the page count in pagination */
	showPageCount?: boolean;
	/** Whether to show page numbers in pagination */
	showPageNumbers?: boolean;
	/** Maximum number of page numbers to show in pagination */
	maxPageNumbers?: number;
	/** Label for the previous page button */
	prevLabel?: string;
	/** Label for the next page button */
	nextLabel?: string;
	/** Message to display when there are no results */
	emptyMessage?: string;
	/** Message to display when there is an error */
	errorMessage?: string;
	/** Message to display when data is loading */
	loadingMessage?: string;
	/** Custom render function for header cells */
	renderHeader?: (header: Header<TData, unknown>) => React.ReactNode;
	/** Custom render function for body cells */
	renderCell?: (row: Row<TData>, index: number) => React.ReactNode;
}

interface StandardWireTableProps extends BaseWireTableProps<WireData> {
	/** Whether to format numeric values */
	formatNumeric?: boolean;
}

type WireTableProps<TData extends object = WireData> = TData extends WireData
	? StandardWireTableProps
	: BaseWireTableProps<TData>;

/**
 * A specialized table component for displaying wire specifications
 * @param props - Component props
 * @returns A table component with wire-specific features
 *
 * @example
 * ```tsx
 * <WireTable
 *   data={wireData}
 *   columns={columns}
 *   title="Wire Specifications"
 *   simple
 *   pageSize={10}
 * />
 * ```
 */
export function WireTable<TData extends object = WireData>({
	data,
	columns,
	title = "Wire Specifications",
	simple = true,
	pageSize = 10,
	className,
	enableMultiSort = false,
	hideSearch = false,
	hidePagination = false,
	showPageCount = true,
	showPageNumbers = true,
	maxPageNumbers = 5,
	prevLabel = "Previous",
	nextLabel = "Next",
	emptyMessage = "No wire specifications found.",
	errorMessage = "An error occurred while loading the wire specifications.",
	loadingMessage = "Loading wire specifications...",
	renderHeader,
	renderCell,
	...props
}: WireTableProps<TData>) {
	const typedColumns = columns as ColumnDef<TData, unknown>[];
	const typedData = data as TData[];
	const typedRenderHeader = renderHeader as
		| ((header: Header<TData, unknown>) => React.ReactNode)
		| undefined;
	const typedRenderCell = renderCell as
		| ((row: Row<TData>, index: number) => React.ReactNode)
		| undefined;

	return (
		<div className={cn("not-prose", className)}>
			<DataTable<TData>
				columns={typedColumns}
				data={typedData}
				title={title}
				simple={simple}
				pageSize={pageSize}
				enableMultiSort={enableMultiSort}
				hideSearch={hideSearch}
				hidePagination={hidePagination}
				showPageCount={showPageCount}
				showPageNumbers={showPageNumbers}
				maxPageNumbers={maxPageNumbers}
				prevLabel={prevLabel}
				nextLabel={nextLabel}
				emptyMessage={emptyMessage}
				errorMessage={errorMessage}
				loadingMessage={loadingMessage}
				renderHeader={typedRenderHeader}
				renderCell={typedRenderCell}
				{...props}
			/>
		</div>
	);
}
