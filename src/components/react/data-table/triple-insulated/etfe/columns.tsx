import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/react/ui/button";
import type { EtfeWireSpec } from "./data";

export const columns: ColumnDef<EtfeWireSpec>[] = [
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
		accessorKey: "awg",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					AWG
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.awg) - Number(rowB.original.awg),
	},
	{
		accessorKey: "conductor.inches",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Conductor (inches)
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.conductor.inches) -
			Number(rowB.original.conductor.inches),
	},
	{
		accessorKey: "conductor.mm",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Conductor (mm)
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.conductor.mm) - Number(rowB.original.conductor.mm),
	},
	{
		accessorKey: "nominalOD.inches",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Nominal O.D. (inches)
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.nominalOD.inches) -
			Number(rowB.original.nominalOD.inches),
	},
	{
		accessorKey: "nominalOD.mm",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Nominal O.D. (mm)
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.nominalOD.mm) - Number(rowB.original.nominalOD.mm),
	},
	{
		accessorKey: "weightLbFt",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Weight (lb/ft)
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.weightLbFt) - Number(rowB.original.weightLbFt),
	},
];
