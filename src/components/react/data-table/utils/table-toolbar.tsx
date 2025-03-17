import type * as React from "react";
import { Button } from "@/components/react/ui";
import { TableSearch } from "./table-search";
import { cn } from "@/lib/utils";

import { Filter, RotateCcw } from "lucide-react";

/**
 * Props for the table wrapper component
 */
interface TableWrapperProps {
	/** The content to wrap */
	children: React.ReactNode;
	/** Additional class name for the wrapper */
	className?: string;
	/** Whether to add a sticky header */
	stickyHeader?: boolean;
}

/**
 * A simple wrapper component that adds a border and rounded corners
 */
export function TableWrapper({
	children,
	className,
	stickyHeader,
}: TableWrapperProps) {
	return (
		<div
			className={cn(
				"rounded-md border",
				stickyHeader && "max-h-[800px] overflow-auto",
				className,
			)}
		>
			{children}
		</div>
	);
}

/**
 * Props for the table toolbar component
 */
interface TableToolbarProps {
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
	/** The current search filter value */
	globalFilter: string;
	/** Callback to update the search filter value */
	setGlobalFilter: (value: string) => void;
	/** Additional class name for the toolbar container */
	className?: string;
	/** Additional content to render in the toolbar */
	children?: React.ReactNode;
	/** Whether the table is in a loading state */
	isLoading?: boolean;
	/** Whether to show the filter button */
	showFilterButton?: boolean;
	/** Callback when the filter button is clicked */
	onFilterClick?: () => void;
	/** Whether to show the reset button */
	showResetButton?: boolean;
	/** Callback when the reset button is clicked */
	onResetClick?: () => void;
	/** Whether the filter is currently active */
	isFilterActive?: boolean;
	/** The number of active filters */
	activeFilterCount?: number;
	/** Whether to show the toolbar actions in a row on mobile */
	mobileActionsInRow?: boolean;
}

/**
 * A toolbar component for tables that includes a title, search input, and optional actions
 * @param props - Component props
 * @returns A toolbar component with title and search functionality
 *
 * @example
 * ```tsx
 * <TableToolbar
 *   title="Users"
 *   globalFilter={filter}
 *   setGlobalFilter={setFilter}
 *   searchPlaceholder="Search users..."
 *   showFilterButton
 *   onFilterClick={handleFilterClick}
 *   isFilterActive={hasActiveFilters}
 *   activeFilterCount={2}
 * />
 * ```
 */
export function TableToolbar({
	title,
	hideSearch,
	searchPlaceholder,
	searchClassName,
	searchWrapperClassName,
	globalFilter,
	setGlobalFilter,
	className,
	children,
	isLoading,
	showFilterButton = false,
	onFilterClick,
	showResetButton = false,
	onResetClick,
	isFilterActive = false,
	activeFilterCount = 0,
	mobileActionsInRow = false,
}: TableToolbarProps) {
	// Type-safe validation
	if (!hideSearch && typeof setGlobalFilter !== "function") {
		throw new TypeError(
			"setGlobalFilter must be a function when search is enabled",
		);
	}

	if (showFilterButton && typeof onFilterClick !== "function") {
		throw new TypeError(
			"onFilterClick must be a function when filter button is shown",
		);
	}

	if (showResetButton && typeof onResetClick !== "function") {
		throw new TypeError(
			"onResetClick must be a function when reset button is shown",
		);
	}

	return (
		<div
			className={cn(
				"mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				className,
			)}
		>
			{/* Title and search section */}
			<div className="flex flex-1 flex-col gap-4">
				{title && (
					<h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
						{title}
					</h3>
				)}
				{!hideSearch && (
					<TableSearch
						value={globalFilter}
						onChange={setGlobalFilter}
						placeholder={searchPlaceholder}
						className={searchClassName}
						wrapperClassName={cn("w-full sm:max-w-xs", searchWrapperClassName)}
						isLoading={isLoading}
					/>
				)}
			</div>

			{/* Actions section */}
			{(showFilterButton || showResetButton || children) && (
				<div
					className={cn(
						"flex flex-wrap items-center gap-2",
						mobileActionsInRow ? "flex-row" : "flex-col sm:flex-row",
					)}
				>
					{showFilterButton && (
						<Button
							onClick={onFilterClick}
							variant={isFilterActive ? "secondary" : "outline"}
							size="sm"
							className="h-8 px-2 lg:px-3"
						>
							<Filter className="h-4 w-4" />
							<span className="ml-2 hidden lg:inline-block">Filter</span>
							{activeFilterCount > 0 && (
								<span className="ml-1 rounded bg-primary px-1 text-xs font-medium text-primary-foreground">
									{activeFilterCount}
								</span>
							)}
						</Button>
					)}
					{showResetButton && (
						<Button
							onClick={onResetClick}
							variant="ghost"
							size="sm"
							className="h-8 px-2 lg:px-3"
						>
							<RotateCcw className="h-4 w-4" />
							<span className="ml-2 hidden lg:inline-block">Reset</span>
						</Button>
					)}
					{children}
				</div>
			)}
		</div>
	);
}
