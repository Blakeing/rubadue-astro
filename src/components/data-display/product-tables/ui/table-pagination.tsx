import { Button } from "@/components/ui";
import type { Table } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Props for the table pagination component
 */
interface TablePaginationProps<TData> {
	/** The table instance */
	table: Table<TData>;
	/** Additional class name for the pagination container */
	className?: string;
	/** Whether to show the current page count */
	showPageCount?: boolean;
	/** Label for the previous page button */
	prevLabel?: string;
	/** Label for the next page button */
	nextLabel?: string;
	/** Whether to show page numbers */
	showPageNumbers?: boolean;
	/** Maximum number of page numbers to show */
	maxPageNumbers?: number;
}

/**
 * A pagination component for tables with previous/next navigation and page numbers
 * @param props - Component props
 * @returns A pagination component with page count and navigation buttons
 *
 * @example
 * ```tsx
 * <TablePagination
 *   table={table}
 *   showPageCount={true}
 *   showPageNumbers={true}
 *   maxPageNumbers={5}
 *   prevLabel="Previous"
 *   nextLabel="Next"
 * />
 * ```
 */
export function TablePagination<TData>({
	table,
	className,
	showPageCount = true,
	prevLabel = "Previous",
	nextLabel = "Next",
	showPageNumbers = false,
	maxPageNumbers = 5,
}: TablePaginationProps<TData>) {
	const { pageIndex, pageSize } = table.getState().pagination;
	const totalPages = table.getPageCount();
	const canPreviousPage = table.getCanPreviousPage();
	const canNextPage = table.getCanNextPage();

	// Calculate the range of items being displayed
	const totalRows = table.getFilteredRowModel().rows.length;
	const start = pageIndex * pageSize + 1;
	const end = Math.min(start + pageSize - 1, totalRows);

	// Calculate visible page numbers
	const getVisiblePageNumbers = () => {
		if (!showPageNumbers || totalPages <= 1) return [];

		const pageNumbers: Array<{ type: "page" | "ellipsis"; value: number }> = [];
		const halfMax = Math.floor(maxPageNumbers / 2);
		let startPage = Math.max(0, pageIndex - halfMax);
		const endPage = Math.min(totalPages - 1, startPage + maxPageNumbers - 1);

		if (endPage - startPage + 1 < maxPageNumbers) {
			startPage = Math.max(0, endPage - maxPageNumbers + 1);
		}

		if (startPage > 0) {
			pageNumbers.push({ type: "page", value: 0 });
			if (startPage > 1) pageNumbers.push({ type: "ellipsis", value: 1 });
		}

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push({ type: "page", value: i });
		}

		if (endPage < totalPages - 1) {
			if (endPage < totalPages - 2) {
				pageNumbers.push({ type: "ellipsis", value: totalPages - 2 });
			}
			pageNumbers.push({ type: "page", value: totalPages - 1 });
		}

		return pageNumbers;
	};

	return (
		<nav
			className={cn(
				"flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between",
				className,
			)}
			aria-label="Table pagination"
		>
			{showPageCount && (
				<div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-2">
					<span className="whitespace-nowrap">
						Showing {start}-{end} of {totalRows}
					</span>
					<span aria-hidden="true" className="hidden sm:inline">
						•
					</span>
					<span className="whitespace-nowrap">
						Page {pageIndex + 1} of {totalPages}
					</span>
				</div>
			)}
			<div className="flex items-center gap-2 sm:ml-auto">
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 sm:hidden"
					onClick={() => table.previousPage()}
					disabled={!canPreviousPage}
					aria-label={`${prevLabel} page`}
					aria-disabled={!canPreviousPage}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="sm"
					className="hidden sm:inline-flex"
					onClick={() => table.previousPage()}
					disabled={!canPreviousPage}
					aria-label={`${prevLabel} page`}
					aria-disabled={!canPreviousPage}
				>
					{prevLabel}
				</Button>

				{showPageNumbers && (
					<div className="flex items-center gap-1">
						{getVisiblePageNumbers().map((item) =>
							item.type === "ellipsis" ? (
								<span
									key={`ellipsis-${item.value}`}
									className="px-1 text-muted-foreground"
									aria-hidden="true"
								>
									...
								</span>
							) : (
								<Button
									key={`page-${item.value}`}
									variant={pageIndex === item.value ? "default" : "outline"}
									size="icon"
									className="h-8 w-8"
									onClick={() => table.setPageIndex(item.value)}
									aria-label={`Go to page ${item.value + 1}`}
									aria-current={pageIndex === item.value ? "page" : undefined}
								>
									{item.value + 1}
								</Button>
							),
						)}
					</div>
				)}

				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 sm:hidden"
					onClick={() => table.nextPage()}
					disabled={!canNextPage}
					aria-label={`${nextLabel} page`}
					aria-disabled={!canNextPage}
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="sm"
					className="hidden sm:inline-flex"
					onClick={() => table.nextPage()}
					disabled={!canNextPage}
					aria-label={`${nextLabel} page`}
					aria-disabled={!canNextPage}
				>
					{nextLabel}
				</Button>
			</div>
		</nav>
	);
}
