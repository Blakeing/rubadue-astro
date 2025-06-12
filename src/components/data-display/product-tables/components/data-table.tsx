import type { ColumnDef, Header, Row } from "@tanstack/react-table";
import type * as React from "react";
import { BaseTable } from "./base-table";

/**
 * Props for the data table component
 */
interface DataTableProps<TData extends object> {
	/** The data to display in the table */
	data: TData[];
	/** The column definitions for the table */
	columns: ColumnDef<TData, unknown>[];
	/** The title to display above the table */
	title?: string;
	/** The number of rows per page */
	pageSize?: number;
	/** Whether to use a simple table layout */
	simple?: boolean;
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
	/** Additional class name for the table container */
	className?: string;
	/** Custom render function for header cells */
	renderHeader?: (header: Header<TData, unknown>) => React.ReactNode;
	/** Custom render function for body cells */
	renderCell?: (row: Row<TData>, index: number) => React.ReactNode;
}

/**
 * A flexible data table component with sorting, filtering, and pagination
 * @param props - Component props
 * @returns A table component with standard features
 *
 * @example
 * ```tsx
 * <DataTable
 *   data={users}
 *   columns={columns}
 *   title="Users"
 *   simple
 *   pageSize={10}
 * />
 * ```
 */
export function DataTable<TData extends object>({
	data,
	columns,
	title,
	pageSize = 10,
	simple = false,
	enableMultiSort = false,
	hideSearch = false,
	hidePagination = false,
	showPageCount = true,
	showPageNumbers = true,
	maxPageNumbers = 5,
	prevLabel = "Previous",
	nextLabel = "Next",
	emptyMessage = "No results found.",
	errorMessage = "An error occurred while loading the data.",
	loadingMessage = "Loading data...",
	className,
	renderHeader,
	renderCell,
}: DataTableProps<TData>) {
	return (
		<BaseTable
			data={data}
			columns={columns}
			title={title}
			pageSize={pageSize}
			enableMultiSort={!simple && enableMultiSort}
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
			renderHeader={renderHeader}
			renderCell={renderCell}
			className={className}
		/>
	);
}
