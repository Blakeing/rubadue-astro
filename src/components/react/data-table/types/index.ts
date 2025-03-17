import type {
	Cell,
	ColumnDef,
	Header,
	HeaderGroup,
	PaginationState,
	Row,
	SortingState,
} from "@tanstack/react-table";
import type { ReactNode } from "react";

/**
 * Base interface for wire data
 */
export interface WireData {
	/** The part number of the wire */
	partNumber: string;
	/** The AWG (American Wire Gauge) size */
	awg: string | number;
	/** The conductor dimensions */
	conductor: {
		/** Conductor diameter in inches */
		inches: string | number;
		/** Conductor diameter in millimeters */
		mm: string | number;
	};
	/** The nominal outer diameter */
	nominalOD: {
		/** Outer diameter in inches */
		inches: string | number;
		/** Outer diameter in millimeters */
		mm: string | number;
	};
	/** Weight in pounds per thousand feet */
	weightLbKft: string | number;
}

/**
 * Data structure for tab configuration
 */
export interface TabData<TData> {
	/** The display label for the tab */
	label: string;
	/** The unique identifier for the tab */
	value: string;
	/** The data to display in the table */
	data: TData[];
}

/**
 * The internal state of the table
 */
export interface TableState {
	/** The current sorting state */
	sorting: SortingState;
	/** The current pagination state */
	pagination: PaginationState;
	/** The current global filter value */
	globalFilter: string;
}

/**
 * Actions to update the table state
 */
export interface TableStateActions {
	/** Update the sorting state */
	setSorting: (value: SortingState) => void;
	/** Update the pagination state */
	setPagination: (value: PaginationState) => void;
	/** Update the global filter value */
	setGlobalFilter: (value: string) => void;
	/** Reset all table state to initial values */
	resetTable: () => void;
}

/**
 * Props for the base table component
 */
export interface BaseTableProps<TData> {
	/** The data to display in the table */
	data: TData[];
	/** The column definitions for the table */
	columns: ColumnDef<TData, unknown>[];
	/** The title to display above the table */
	title?: string;
	/** Whether to enable multi-column sorting */
	enableMultiSort?: boolean;
	/** The number of rows per page */
	pageSize?: number;
	/** Custom render function for header cells */
	renderHeader?: (header: Header<TData, unknown>) => React.ReactNode;
	/** Custom render function for body cells */
	renderCell?: (row: Row<TData>, index: number) => React.ReactNode;
	/** Additional class name for the table container */
	className?: string;
	/** Placeholder text for the search input */
	searchPlaceholder?: string;
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
	/** Additional class name for the search input */
	searchClassName?: string;
	/** Additional class name for the search input wrapper */
	searchWrapperClassName?: string;
	/** Additional class name for the pagination */
	paginationClassName?: string;
	/** Additional class name for the header */
	headerClassName?: string;
	/** Additional class name for the body */
	bodyClassName?: string;
	/** Additional class name for rows */
	rowClassName?: string;
	/** Additional class name for cells */
	cellClassName?: string;
	/** Callback when a row is clicked */
	onRowClick?: (row: Row<TData>) => void;
	/** Function to determine if a row is selected */
	isRowSelected?: (row: Row<TData>) => boolean;
	/** Whether the table is loading */
	isLoading?: boolean;
	/** Error object if there is an error */
	error?: Error | null;
	/** Whether to make the header sticky */
	stickyHeader?: boolean;
}

/**
 * Props for the table content component
 */
export interface TableContentProps<TData> {
	/** The rows from the table instance */
	rows: Row<TData>[];
	/** The number of columns */
	columns: number;
	/** Whether the table is loading */
	isLoading?: boolean;
	/** Error object if there is an error */
	error?: boolean;
	/** Message to display when there are no results */
	emptyMessage?: string;
	/** Message to display when there is an error */
	errorMessage?: string;
	/** Message to display when data is loading */
	loadingMessage?: string;
	/** Additional class name for rows */
	rowClassName?: string;
	/** Additional class name for cells */
	cellClassName?: string;
	/** Callback when a row is clicked */
	onRowClick?: (row: Row<TData>) => void;
	/** Function to determine if a row is selected */
	isRowSelected?: (row: Row<TData>) => boolean;
	/** Custom render function for body cells */
	renderCell?: (row: Row<TData>, index: number) => ReactNode;
	/** Virtualization props */
	enableVirtualization?: boolean;
	estimateSize?: number;
	overscan?: number;
}

/**
 * Props for the table header content component
 */
export interface TableHeaderContentProps<TData> {
	/** The header groups from the table instance */
	headerGroups: HeaderGroup<TData>[];
	/** Custom render function for header cells */
	renderHeader?: (header: Header<TData, unknown>) => React.ReactNode;
	/** Additional class name for cells */
	cellClassName?: string;
}

/**
 * Props for the table toolbar component
 */
export interface TableToolbarProps {
	/** The title to display above the table */
	title?: string;
	/** Whether to hide the search input */
	hideSearch?: boolean;
	/** Placeholder text for the search input */
	searchPlaceholder?: string;
	/** Additional class name for the search input */
	searchClassName?: string;
	/** Additional class name for the search input wrapper */
	searchWrapperClassName?: string;
	/** The current global filter value */
	globalFilter: string;
	/** Callback to update the global filter value */
	setGlobalFilter: (value: string) => void;
	/** Additional class name for the toolbar container */
	className?: string;
}
