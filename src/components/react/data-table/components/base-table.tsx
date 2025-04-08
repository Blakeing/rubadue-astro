import { Table, TableBody, TableHeader } from "@/components/react/ui";
import type * as React from "react";

import { cn } from "@/lib/utils";
import { TableContent } from "../ui/table-content";
import { TableHeaderContent } from "../ui/table-header";
import { TablePagination } from "../ui/table-pagination";
import { TableToolbar, TableWrapper } from "../ui/table-toolbar";
import type { BaseTableProps } from "../types";
import { useTable } from "../hooks/use-table";

/**
 * A flexible table component with sorting, filtering, and pagination
 * @param props - Component props
 * @returns A table component with toolbar, header, content, and pagination
 *
 * @example
 * ```tsx
 * <BaseTable
 *   data={users}
 *   columns={columns}
 *   title="Users"
 *   searchPlaceholder="Search users..."
 * />
 * ```
 */
export function BaseTable<TData extends object>({
	data,
	columns,
	title,
	enableMultiSort = false,
	pageSize = 10,
	renderHeader,
	renderCell,
	className,
	searchPlaceholder,
	hideSearch = false,
	hidePagination = false,
	showPageCount = true,
	showPageNumbers,
	maxPageNumbers,
	prevLabel,
	nextLabel,
	emptyMessage = "No results.",
	errorMessage = "An error occurred while loading the data.",
	loadingMessage = "Loading data...",
	searchClassName,
	searchWrapperClassName,
	paginationClassName,
	headerClassName,
	bodyClassName,
	rowClassName,
	cellClassName,
	onRowClick,
	isRowSelected,
	isLoading = false,
	error = null,
	stickyHeader = false,
}: BaseTableProps<TData>) {
	// Validate required props
	if (!Array.isArray(data)) {
		throw new Error("data must be an array");
	}
	if (!Array.isArray(columns)) {
		throw new Error("columns must be an array");
	}
	if (pageSize <= 0) {
		throw new Error("pageSize must be a positive number");
	}

	const { table, globalFilter, setGlobalFilter } = useTable({
		data,
		columns,
		enableMultiSort,
		pageSize,
	});

	// Get table state
	const rowModel = table.getRowModel();
	const headerGroups = table.getHeaderGroups();
	const totalRows = rowModel.rows.length;

	return (
		<section
			className={className}
			aria-label={title || "Data table"}
			{...(isLoading && { "aria-busy": true })}
		>
			<TableToolbar
				title={title}
				hideSearch={hideSearch}
				searchPlaceholder={searchPlaceholder}
				searchClassName={searchClassName}
				searchWrapperClassName={searchWrapperClassName}
				globalFilter={globalFilter}
				setGlobalFilter={setGlobalFilter}
				isLoading={isLoading}
			/>
			<TableWrapper>
				<Table>
					<TableHeader
						className={cn(
							headerClassName,
							stickyHeader &&
								"sticky top-0 z-10 border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60",
						)}
					>
						<TableHeaderContent
							headerGroups={headerGroups}
							renderHeader={renderHeader}
							cellClassName={cellClassName}
						/>
					</TableHeader>
					<TableBody className={bodyClassName}>
						<TableContent<TData>
							rows={rowModel.rows}
							columns={columns.length}
							isLoading={isLoading}
							error={!!error}
							emptyMessage={emptyMessage}
							errorMessage={errorMessage}
							loadingMessage={loadingMessage}
							rowClassName={rowClassName}
							cellClassName={cellClassName}
							onRowClick={onRowClick}
							isRowSelected={isRowSelected}
							renderCell={renderCell}
						/>
					</TableBody>
				</Table>
			</TableWrapper>
			{!hidePagination && totalRows > 0 && !error && !isLoading && (
				<TablePagination
					table={table}
					showPageCount={showPageCount}
					showPageNumbers={showPageNumbers}
					maxPageNumbers={maxPageNumbers}
					prevLabel={prevLabel}
					nextLabel={nextLabel}
					className={paginationClassName}
				/>
			)}
		</section>
	);
}
