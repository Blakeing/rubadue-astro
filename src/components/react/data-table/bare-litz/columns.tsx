import { Button } from "@/components/react/ui";
import type { ColumnDef } from "@tanstack/table-core";
import { ArrowUpDown } from "lucide-react";
import type { BareLitzWireSpec } from "./data";

export const columns: ColumnDef<BareLitzWireSpec>[] = [
	{
		accessorKey: "equivalentAWG",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Equivalent AWG
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.equivalentAWG) - Number(rowB.original.equivalentAWG),
	},
	{
		accessorKey: "nominalCircularMil",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Nominal Circular Mil
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const value = Number.parseInt(row.getValue("nominalCircularMil"));
			return value.toLocaleString();
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.nominalCircularMil) -
			Number(rowB.original.nominalCircularMil),
	},
	{
		accessorKey: "numberOfWires",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Number of Wires
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const value = Number.parseInt(row.getValue("numberOfWires"));
			return value.toLocaleString();
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.numberOfWires) - Number(rowB.original.numberOfWires),
	},
	{
		accessorKey: "magnetWireSize",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Magnet Wire Size (AWG)
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.magnetWireSize) -
			Number(rowB.original.magnetWireSize),
	},
	{
		accessorKey: "litzWireType",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Litz Wire Type
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.litzWireType) - Number(rowB.original.litzWireType),
	},
	{
		accessorKey: "nominalODIn",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Nominal OD (in.)
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const value = Number.parseFloat(row.getValue("nominalODIn"));
			return value.toFixed(3);
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.nominalODIn) - Number(rowB.original.nominalODIn),
	},
	{
		accessorKey: "nominalODMm",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Nominal OD (mm)
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const value = Number.parseFloat(row.getValue("nominalODMm"));
			return value.toFixed(3);
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.nominalODMm) - Number(rowB.original.nominalODMm),
	},
	{
		accessorKey: "maxDCResistance",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Maximum DC Resistance
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const value = Number.parseFloat(row.getValue("maxDCResistance"));
			return value.toFixed(5);
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.maxDCResistance) -
			Number(rowB.original.maxDCResistance),
	},
	{
		accessorKey: "nominalLbs1000Ft",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Nominal Lbs/1,000 Ft.
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const value = Number.parseFloat(row.getValue("nominalLbs1000Ft"));
			return value.toFixed(1);
		},
		sortingFn: (rowA, rowB) =>
			Number(rowA.original.nominalLbs1000Ft) -
			Number(rowB.original.nominalLbs1000Ft),
	},
	{
		accessorKey: "litzWireConstruction",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Litz Wire Construction
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
];
