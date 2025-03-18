import { Button } from "@/components/react/ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { InsulatedLitzSpec } from "@/components/react/data-table/insulated-litz/types";

import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";

export const createInsulatedLitzColumns = <
	T extends InsulatedLitzSpec,
>(): ColumnDef<T>[] => [
	{
		accessorKey: "partNumber",
		header: ({ column }) => {
			const isSorted = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(isSorted === "asc")}
					className="hover:bg-muted/50"
					aria-label={`Sort by Part Number ${
						isSorted === "asc" ? "descending" : "ascending"
					}`}
				>
					Part Number
					<ArrowUpDown
						className={cn("ml-2 h-4 w-4", isSorted && "text-primary")}
						aria-hidden="true"
					/>
				</Button>
			);
		},
	},
	{
		accessorKey: "equivalentAWG",
		header: ({ column }) => {
			const isSorted = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(isSorted === "asc")}
					className="hover:bg-muted/50"
					aria-label={`Sort by Equiv. AWG ${
						isSorted === "asc" ? "descending" : "ascending"
					}`}
				>
					Equiv. AWG
					<ArrowUpDown
						className={cn("ml-2 h-4 w-4", isSorted && "text-primary")}
						aria-hidden="true"
					/>
				</Button>
			);
		},
		sortingFn: (rowA, rowB) => {
			const a = rowA.original.equivalentAWG;
			const b = rowB.original.equivalentAWG;
			return a == null || b == null ? 0 : Number(a) - Number(b);
		},
	},
	{
		accessorKey: "coreDiameter",
		header: ({ column }) => {
			const isSorted = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(isSorted === "asc")}
					className="hover:bg-muted/50"
					aria-label={`Sort by Core O.D. ${
						isSorted === "asc" ? "descending" : "ascending"
					}`}
				>
					Core O.D. (in.)
					<ArrowUpDown
						className={cn("ml-2 h-4 w-4", isSorted && "text-primary")}
						aria-hidden="true"
					/>
				</Button>
			);
		},
		sortingFn: (rowA, rowB) => {
			const a = rowA.original.coreDiameter;
			const b = rowB.original.coreDiameter;
			return a == null || b == null ? 0 : Number(a) - Number(b);
		},
	},
	{
		accessorKey: "circularMils",
		header: ({ column }) => {
			const isSorted = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(isSorted === "asc")}
					className="hover:bg-muted/50"
					aria-label={`Sort by Cir. Mils ${
						isSorted === "asc" ? "descending" : "ascending"
					}`}
				>
					Cir. Mils
					<ArrowUpDown
						className={cn("ml-2 h-4 w-4", isSorted && "text-primary")}
						aria-hidden="true"
					/>
				</Button>
			);
		},
		cell: ({ row }) => {
			const value = row.original.circularMils;
			return value?.toLocaleString() ?? "";
		},
		sortingFn: (rowA, rowB) => {
			const a = rowA.original.circularMils;
			const b = rowB.original.circularMils;
			return a == null || b == null ? 0 : Number(a) - Number(b);
		},
	},
	{
		accessorKey: "numberOfStrands",
		header: ({ column }) => {
			const isSorted = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(isSorted === "asc")}
					className="hover:bg-muted/50"
					aria-label={`Sort by No. Strands ${
						isSorted === "asc" ? "descending" : "ascending"
					}`}
				>
					No. Strands
					<ArrowUpDown
						className={cn("ml-2 h-4 w-4", isSorted && "text-primary")}
						aria-hidden="true"
					/>
				</Button>
			);
		},
		cell: ({ row }) => {
			const value = row.original.numberOfStrands;
			return value?.toLocaleString() ?? "";
		},
		sortingFn: (rowA, rowB) => {
			const a = rowA.original.numberOfStrands;
			const b = rowB.original.numberOfStrands;
			return a == null || b == null ? 0 : Number(a) - Number(b);
		},
	},
	{
		accessorKey: "awgOfStrands",
		header: ({ column }) => {
			const isSorted = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(isSorted === "asc")}
					className="hover:bg-muted/50"
					aria-label={`Sort by AWG of Strands ${
						isSorted === "asc" ? "descending" : "ascending"
					}`}
				>
					AWG of Strands
					<ArrowUpDown
						className={cn("ml-2 h-4 w-4", isSorted && "text-primary")}
						aria-hidden="true"
					/>
				</Button>
			);
		},
		sortingFn: (rowA, rowB) => {
			const a = rowA.original.awgOfStrands;
			const b = rowB.original.awgOfStrands;
			return a == null || b == null ? 0 : Number(a) - Number(b);
		},
	},
	{
		accessorKey: "nominalOD",
		header: ({ column }) => {
			const isSorted = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(isSorted === "asc")}
					className="hover:bg-muted/50"
					aria-label={`Sort by Nominal O.D. ${
						isSorted === "asc" ? "descending" : "ascending"
					}`}
				>
					Nominal O.D. (in.)
					<ArrowUpDown
						className={cn("ml-2 h-4 w-4", isSorted && "text-primary")}
						aria-hidden="true"
					/>
				</Button>
			);
		},
		sortingFn: (rowA, rowB) => {
			const a = rowA.original.nominalOD;
			const b = rowB.original.nominalOD;
			return a == null || b == null ? 0 : Number(a) - Number(b);
		},
	},
	{
		accessorKey: "suggestedOperatingFreq",
		header: ({ column }) => {
			const isSorted = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(isSorted === "asc")}
					className="hover:bg-muted/50"
					aria-label={`Sort by Suggested Operating Frequency ${
						isSorted === "asc" ? "descending" : "ascending"
					}`}
				>
					Suggested Operating Frequency
					<ArrowUpDown
						className={cn("ml-2 h-4 w-4", isSorted && "text-primary")}
						aria-hidden="true"
					/>
				</Button>
			);
		},
	},
];
