import {
	type ColumnDef,
	type SortingState,
	type PaginationState,
	type Table,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { useDebouncedSearch } from "./use-debounced-search";

/**
 * Options for configuring the table hook
 */
interface UseTableOptions<TData> {
	/** The data to display in the table */
	data: TData[];
	/** The column definitions for the table */
	columns: ColumnDef<TData, unknown>[];
	/** Whether to enable multi-column sorting */
	enableMultiSort?: boolean;
	/** The number of rows per page */
	pageSize?: number;
	/** Initial sorting state */
	initialSorting?: SortingState;
	/** Initial pagination state */
	initialPagination?: PaginationState;
	/** Delay in milliseconds before applying search filter */
	searchDelay?: number;
}

/**
 * Return value from the table hook
 */
interface UseTableReturn<TData> {
	/** The table instance */
	table: Table<TData>;
	/** The current global filter value */
	globalFilter: string;
	/** Function to update the global filter */
	setGlobalFilter: (value: string) => void;
	/** The current sorting state */
	sorting: SortingState;
	/** Function to update the sorting state */
	setSorting: (value: SortingState) => void;
	/** The current pagination state */
	pagination: PaginationState;
	/** Function to update the pagination state */
	setPagination: (value: PaginationState) => void;
	/** Function to reset all table state */
	resetTable: () => void;
}

/**
 * Custom hook for managing table state and functionality
 * @param options - Configuration options for the table
 * @returns Table instance and state management functions
 *
 * @example
 * ```tsx
 * const { table, globalFilter, setGlobalFilter } = useTable({
 *   data,
 *   columns,
 *   pageSize: 10,
 * });
 * ```
 */
export function useTable<TData>({
	data,
	columns,
	enableMultiSort = false,
	pageSize = 10,
	initialSorting = [],
	initialPagination = { pageIndex: 0, pageSize },
	searchDelay = 300,
}: UseTableOptions<TData>): UseTableReturn<TData> {
	// Validate inputs
	if (!Array.isArray(data)) {
		throw new Error("Table data must be an array");
	}
	if (!Array.isArray(columns)) {
		throw new Error("Table columns must be an array");
	}
	if (pageSize <= 0) {
		throw new Error("Page size must be a positive number");
	}

	const {
		value: globalFilter,
		debouncedValue: debouncedGlobalFilter,
		handleChange: setGlobalFilter,
	} = useDebouncedSearch({
		initialValue: "",
		delay: searchDelay,
	});

	const [sorting, setSorting] = useState<SortingState>(initialSorting);
	const [pagination, setPagination] =
		useState<PaginationState>(initialPagination);

	// Memoize the resetTable function to prevent unnecessary re-renders
	const resetTable = useMemo(
		() => () => {
			setGlobalFilter("");
			setSorting(initialSorting);
			setPagination(initialPagination);
		},
		[initialSorting, initialPagination, setGlobalFilter],
	);

	// Memoize the table instance to prevent unnecessary re-renders
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			globalFilter: debouncedGlobalFilter,
			pagination,
		},
		enableMultiSort,
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return {
		table,
		globalFilter,
		setGlobalFilter,
		sorting,
		setSorting,
		pagination,
		setPagination,
		resetTable,
	};
}
