import * as React from "react";
import {
	type ColumnDef,
	type SortingState,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getSortedRowModel,
	getPaginationRowModel,
	getFilteredRowModel,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/react/ui/table";
import { Button } from "@/components/react/ui/button";
import { Input } from "@/components/react/ui/input";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

interface SimpleDataTableProps<TData> {
	data: TData[];
	columns: ColumnDef<TData, string>[];
}

export function SimpleDataTable<TData>({
	data,
	columns,
}: SimpleDataTableProps<TData>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = React.useState("");

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		state: {
			sorting,
			globalFilter,
		},
		initialState: {
			pagination: {
				pageSize: 10,
			},
		},
		enableSorting: true,
		enableMultiSort: true,
	});

	return (
		<div>
			<h3 className="text-xl  font-bold tracking-tight text-foreground sm:text-2xl">
				Wire Specifications
			</h3>
			<div className="flex items-center py-4">
				<Input
					placeholder="Search all columns..."
					value={globalFilter}
					onChange={(event) => setGlobalFilter(event.target.value)}
					className="max-w-sm"
				/>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										colSpan={header.colSpan}
										className={`text-left p-4 ${
											header.column.getCanSort()
												? "cursor-pointer select-none"
												: ""
										} ${
											headerGroup.depth === 0
												? header.colSpan > 1
													? "border-b-0"
													: "opacity-0"
												: "border-t"
										}`}
										onClick={(e) =>
											header.column.getCanSort()
												? header.column.getToggleSortingHandler()?.(e)
												: undefined
										}
										onKeyDown={(e) => {
											if (
												header.column.getCanSort() &&
												(e.key === "Enter" || e.key === " ")
											) {
												e.preventDefault();
												header.column.getToggleSortingHandler()?.(e);
											}
										}}
										tabIndex={header.column.getCanSort() ? 0 : undefined}
										role={header.column.getCanSort() ? "button" : undefined}
									>
										{header.isPlaceholder ? null : (
											<div className="flex items-center space-x-2">
												{flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
												{header.column.getCanSort() && (
													<span className="ml-2 h-4 w-4">
														{header.column.getIsSorted() === "desc" ? (
															<ArrowDown className="h-4 w-4" />
														) : header.column.getIsSorted() === "asc" ? (
															<ArrowUp className="h-4 w-4" />
														) : (
															<ChevronsUpDown className="h-4 w-4" />
														)}
													</span>
												)}
											</div>
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="text-left p-4">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-between space-x-2 py-4">
				<div className="text-sm text-muted-foreground">
					Page {table.getState().pagination.pageIndex + 1} of{" "}
					{table.getPageCount()}
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
