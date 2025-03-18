import type { WireData } from "../types";
import type { ColumnDef, HeaderContext } from "@tanstack/react-table";
import { Button } from "@/components/react/ui";
import { ArrowUpDown } from "lucide-react";
import * as React from "react";

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
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="hover:bg-muted/50"
				>
					PART NUMBER
					<ArrowUpDown
						className={
							column.getIsSorted()
								? "ml-2 h-4 w-4 text-primary"
								: "ml-2 h-4 w-4"
						}
					/>
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
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="hover:bg-muted/50"
				>
					AWG
					<ArrowUpDown
						className={
							column.getIsSorted()
								? "ml-2 h-4 w-4 text-primary"
								: "ml-2 h-4 w-4"
						}
					/>
				</Button>
			),
			cell: ({ row }) => {
				const value = row.original.awg;
				return formatNumber(value, 2);
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
				<div className="text-muted-foreground font-medium">CONDUCTOR</div>
			),
			columns: [
				{
					id: "conductor.inches",
					accessorKey: "conductor.inches",
					header: ({ column }: HeaderContext<T, unknown>) => (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
							className="hover:bg-muted/50"
						>
							INCHES
							<ArrowUpDown
								className={
									column.getIsSorted()
										? "ml-2 h-4 w-4 text-primary"
										: "ml-2 h-4 w-4"
								}
							/>
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
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
							className="hover:bg-muted/50"
						>
							MM
							<ArrowUpDown
								className={
									column.getIsSorted()
										? "ml-2 h-4 w-4 text-primary"
										: "ml-2 h-4 w-4"
								}
							/>
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
				<div className="text-muted-foreground font-medium">NOMINAL O.D.</div>
			),
			columns: [
				{
					id: "nominalOD.inches",
					accessorKey: "nominalOD.inches",
					header: ({ column }: HeaderContext<T, unknown>) => (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
							className="hover:bg-muted/50"
						>
							INCHES
							<ArrowUpDown
								className={
									column.getIsSorted()
										? "ml-2 h-4 w-4 text-primary"
										: "ml-2 h-4 w-4"
								}
							/>
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
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
							className="hover:bg-muted/50"
						>
							MM
							<ArrowUpDown
								className={
									column.getIsSorted()
										? "ml-2 h-4 w-4 text-primary"
										: "ml-2 h-4 w-4"
								}
							/>
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
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="hover:bg-muted/50"
				>
					WEIGHT LB/KFT
					<ArrowUpDown
						className={
							column.getIsSorted()
								? "ml-2 h-4 w-4 text-primary"
								: "ml-2 h-4 w-4"
						}
					/>
				</Button>
			),
			cell: ({ row }) => {
				const value = row.original.weightLbKft;
				return formatNumber(value, 3);
			},
			sortingFn: (rowA, rowB) => {
				const a = Number(rowA.original.weightLbKft);
				const b = Number(rowB.original.weightLbKft);
				return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
			},
		},
	];
}
