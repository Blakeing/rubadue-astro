import { Button } from "@/components/react/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import type { DoubleInsulatedLitzSpec } from "./data";

export const columns: ColumnDef<DoubleInsulatedLitzSpec>[] = [
	{
		accessorKey: "partNumber",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Part Number
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "equivalentAWG",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Equiv. AWG
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.equivalentAWG) - Number(rowB.original.equivalentAWG),
	},
	{
		accessorKey: "coreDiameter",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Core O.D. (in.)
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.coreDiameter) - Number(rowB.original.coreDiameter),
	},
	{
		accessorKey: "circularMils",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Cir. Mils
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const value = Number.parseInt(row.getValue("circularMils"));
			return value.toLocaleString();
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.circularMils) - Number(rowB.original.circularMils),
	},
	{
		accessorKey: "numberOfStrands",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					No. Strands
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const value = Number.parseInt(row.getValue("numberOfStrands"));
			return value.toLocaleString();
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.numberOfStrands) -
			Number(rowB.original.numberOfStrands),
	},
	{
		accessorKey: "awgOfStrands",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					AWG of Strands
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.awgOfStrands) - Number(rowB.original.awgOfStrands),
	},
	{
		accessorKey: "nominalOD",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Nominal O.D. (in.)
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.nominalOD) - Number(rowB.original.nominalOD),
	},
	{
		accessorKey: "suggestedOperatingFreq",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Suggested Operating Frequency
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
];
