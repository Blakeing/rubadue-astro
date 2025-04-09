import type { WireData } from "../types";
import type { ColumnDef, HeaderContext } from "@tanstack/react-table";
import { Button } from "@/components/react/ui";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

/**
 * Safely formats a number with the specified decimal places
 * @param value The value to format
 * @param decimals The number of decimal places
 * @returns The formatted number or an empty string if invalid
 */
function formatNumber(
	value: string | number | undefined | null,
	decimals: number,
): string {
	if (value == null) return "";
	const num = typeof value === "string" ? Number.parseFloat(value) : value;
	return Number.isNaN(num) ? "" : num.toFixed(decimals);
}

/**
 * Formats an AWG value, handling both whole numbers and strand count formats
 * @param value The AWG value to format
 * @returns The formatted AWG value
 */
function formatAWG(value: string | number | undefined | null): string {
	if (value == null) return "";
	if (typeof value === "string") {
		// If the value contains a slash, it's a strand count format
		if (value.includes("/")) {
			return value;
		}
		const num = Number.parseFloat(value);
		return Number.isNaN(num) ? "" : num.toString();
	}
	return value.toString();
}

// Helper function to get sort icon
function getSortIcon(isSorted: boolean | string) {
	if (isSorted === "asc") {
		return <ArrowUp className="ml-2 h-4 w-4 text-primary" />;
	}
	if (isSorted === "desc") {
		return <ArrowDown className="ml-2 h-4 w-4 text-primary" />;
	}
	return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
}

// Helper function to get next sort state
function getNextSortState(
	currentState: boolean | string,
): "asc" | "desc" | false {
	if (currentState === false) return "asc";
	if (currentState === "asc") return "desc";
	return false;
}

/**
 * Creates column definitions for wire tables
 * @returns Array of column definitions
 */
export function createWireColumns<T extends WireData>(): ColumnDef<
	T,
	unknown
>[] {
	return [
		{
			accessorKey: "partNumber",
			header: ({ column }: HeaderContext<T, unknown>) => (
				<Button
					variant="ghost"
					onClick={() => {
						const nextState = getNextSortState(column.getIsSorted());
						if (nextState === false) {
							column.clearSorting();
						} else {
							column.toggleSorting(nextState === "desc");
						}
					}}
					className="hover:bg-muted/50"
				>
					PART NUMBER
					{getSortIcon(column.getIsSorted())}
				</Button>
			),
			sortingFn: (rowA, rowB) => {
				const a = rowA.original.partNumber;
				const b = rowB.original.partNumber;
				return a.localeCompare(b);
			},
		},
		{
			accessorKey: "awg",
			header: ({ column }: HeaderContext<T, unknown>) => (
				<Button
					variant="ghost"
					onClick={() => {
						const nextState = getNextSortState(column.getIsSorted());
						if (nextState === false) {
							column.clearSorting();
						} else {
							column.toggleSorting(nextState === "desc");
						}
					}}
					className="hover:bg-muted/50"
				>
					AWG
					{getSortIcon(column.getIsSorted())}
				</Button>
			),
			cell: ({ row }) => {
				const value = row.original.awg;
				return formatAWG(value);
			},
			sortingFn: (rowA, rowB) => {
				const a = Number(rowA.original.awg);
				const b = Number(rowB.original.awg);
				return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
			},
		},
		{
			id: "conductor",
			header: () => (
				<div className="px-4 text-muted-foreground font-medium">CONDUCTOR</div>
			),
			columns: [
				{
					id: "conductor.inches",
					accessorKey: "conductor.inches",
					header: ({ column }: HeaderContext<T, unknown>) => (
						<Button
							variant="ghost"
							onClick={() => {
								const nextState = getNextSortState(column.getIsSorted());
								if (nextState === false) {
									column.clearSorting();
								} else {
									column.toggleSorting(nextState === "desc");
								}
							}}
							className="hover:bg-muted/50"
						>
							INCHES
							{getSortIcon(column.getIsSorted())}
						</Button>
					),
					cell: ({ row }) => {
						const value = row.original.conductor?.inches;
						return formatNumber(value, 4);
					},
					sortingFn: (rowA, rowB) => {
						const a = Number(rowA.original.conductor?.inches);
						const b = Number(rowB.original.conductor?.inches);
						return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
					},
				},
				{
					id: "conductor.mm",
					accessorKey: "conductor.mm",
					header: ({ column }: HeaderContext<T, unknown>) => (
						<Button
							variant="ghost"
							onClick={() => {
								const nextState = getNextSortState(column.getIsSorted());
								if (nextState === false) {
									column.clearSorting();
								} else {
									column.toggleSorting(nextState === "desc");
								}
							}}
							className="hover:bg-muted/50"
						>
							MM
							{getSortIcon(column.getIsSorted())}
						</Button>
					),
					cell: ({ row }) => {
						const value = row.original.conductor?.mm;
						return formatNumber(value, 3);
					},
					sortingFn: (rowA, rowB) => {
						const a = Number(rowA.original.conductor?.mm);
						const b = Number(rowB.original.conductor?.mm);
						return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
					},
				},
			],
		},
		{
			id: "nominalOD",
			header: () => (
				<div className="px-4 text-muted-foreground font-medium">
					NOMINAL O.D.
				</div>
			),
			columns: [
				{
					id: "nominalOD.inches",
					accessorKey: "nominalOD.inches",
					header: ({ column }: HeaderContext<T, unknown>) => (
						<Button
							variant="ghost"
							onClick={() => {
								const nextState = getNextSortState(column.getIsSorted());
								if (nextState === false) {
									column.clearSorting();
								} else {
									column.toggleSorting(nextState === "desc");
								}
							}}
							className="hover:bg-muted/50"
						>
							INCHES
							{getSortIcon(column.getIsSorted())}
						</Button>
					),
					cell: ({ row }) => {
						const value = row.original.nominalOD?.inches;
						return formatNumber(value, 4);
					},
					sortingFn: (rowA, rowB) => {
						const a = Number(rowA.original.nominalOD?.inches);
						const b = Number(rowB.original.nominalOD?.inches);
						return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
					},
				},
				{
					id: "nominalOD.mm",
					accessorKey: "nominalOD.mm",
					header: ({ column }: HeaderContext<T, unknown>) => (
						<Button
							variant="ghost"
							onClick={() => {
								const nextState = getNextSortState(column.getIsSorted());
								if (nextState === false) {
									column.clearSorting();
								} else {
									column.toggleSorting(nextState === "desc");
								}
							}}
							className="hover:bg-muted/50"
						>
							MM
							{getSortIcon(column.getIsSorted())}
						</Button>
					),
					cell: ({ row }) => {
						const value = row.original.nominalOD?.mm;
						return formatNumber(value, 3);
					},
					sortingFn: (rowA, rowB) => {
						const a = Number(rowA.original.nominalOD?.mm);
						const b = Number(rowB.original.nominalOD?.mm);
						return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
					},
				},
			],
		},
		{
			accessorKey: "weightLbKft",
			header: ({ column }: HeaderContext<T, unknown>) => (
				<Button
					variant="ghost"
					onClick={() => {
						const nextState = getNextSortState(column.getIsSorted());
						if (nextState === false) {
							column.clearSorting();
						} else {
							column.toggleSorting(nextState === "desc");
						}
					}}
					className="hover:bg-muted/50"
				>
					WEIGHT LB/KFT
					{getSortIcon(column.getIsSorted())}
				</Button>
			),
			cell: ({ row }) => {
				const value = row.original.weightLbKft;
				if (typeof value === "string") {
					return value;
				}
				return formatNumber(value, 2);
			},
			sortingFn: (rowA, rowB) => {
				const a = Number(rowA.original.weightLbKft);
				const b = Number(rowB.original.weightLbKft);
				return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
			},
		},
	];
}
