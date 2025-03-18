import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/react/ui";
import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import type { TabData } from "../types";
import { DataTable } from "./data-table";

interface SwitchableDataTableProps<TData extends object> {
	/** Array of tab/select configurations */
	items: TabData<TData>[];
	/** Column definitions for the table */
	columns: ColumnDef<TData, unknown>[];
	/** The initially active item value */
	defaultValue?: string;
	/** Optional title for the table */
	title?: string;
	/** The variant of the switcher to use - either 'tabs' or 'select' */
	variant: "tabs" | "select";
	/** Optional placeholder for select variant */
	placeholder?: string;
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
}

/**
 * A table component that can switch between different data sets using either tabs or a select dropdown
 * @param props - Component props
 * @returns A table component with switching functionality
 *
 * @example
 * ```tsx
 * <SwitchableDataTable
 *   items={[
 *     { value: "tab1", label: "Tab 1", data: data1 },
 *     { value: "tab2", label: "Tab 2", data: data2 }
 *   ]}
 *   columns={columns}
 *   variant="tabs"
 *   title="Switchable Table"
 * />
 * ```
 */
export function SwitchableDataTable<TData extends object>({
	items,
	columns,
	defaultValue,
	title,
	variant,
	placeholder = "Please select an option",
	pageSize,
	simple,
	enableMultiSort,
	hideSearch,
	hidePagination,
	showPageCount,
	showPageNumbers,
	maxPageNumbers,
	prevLabel,
	nextLabel,
	emptyMessage,
	errorMessage,
	loadingMessage,
	className,
}: SwitchableDataTableProps<TData>) {
	if (!items.length) {
		throw new Error("items array must not be empty");
	}

	const [activeValue, setActiveValue] = React.useState<string>(
		defaultValue || items[0].value,
	);

	const activeItem = React.useMemo(
		() => items.find((item) => item.value === activeValue) || items[0],
		[items, activeValue],
	);

	if (variant === "select") {
		return (
			<div className="not-prose">
				{title && (
					<h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl mb-4">
						{title}
					</h3>
				)}
				<div className="space-y-2">
					<Select value={activeValue} onValueChange={setActiveValue}>
						<SelectTrigger className="w-[300px]">
							<SelectValue placeholder={placeholder}>
								{activeItem.label}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{items.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<DataTable<TData>
					columns={columns}
					data={activeItem.data}
					title={title}
					pageSize={pageSize}
					simple={simple}
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
					className={className}
				/>
			</div>
		);
	}

	return (
		<Tabs value={activeValue} className="w-full">
			<div className="md:hidden">
				<Select value={activeValue} onValueChange={setActiveValue}>
					<SelectTrigger className="w-full">
						<SelectValue>{activeItem.label}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{items.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="hidden md:block">
				<TabsList className="h-10 flex w-fit">
					{items.map((item) => (
						<TabsTrigger
							key={item.value}
							value={item.value}
							onClick={() => setActiveValue(item.value)}
						>
							{item.label}
						</TabsTrigger>
					))}
				</TabsList>
			</div>
			{items.map((item) => (
				<TabsContent
					key={item.value}
					value={item.value}
					role="tabpanel"
					aria-label={`${item.label} table`}
				>
					<DataTable<TData>
						columns={columns}
						data={item.data}
						title={title}
						pageSize={pageSize}
						simple={simple}
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
						className={className}
					/>
				</TabsContent>
			))}
		</Tabs>
	);
}
