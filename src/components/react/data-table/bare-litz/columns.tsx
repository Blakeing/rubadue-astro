import { Button } from "@/components/react/ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { BareLitzWireSpec } from "./data";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { createSortableHeader } from "../utils/sorting";

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
 * Safely formats a number with the specified decimal places
 */
function formatNumber(
	value: string | number | undefined | null,
	decimals: number,
): string {
	if (value == null) return "";
	const num = typeof value === "string" ? Number.parseFloat(value) : value;
	return Number.isNaN(num) ? "" : num.toFixed(decimals);
}

export const columns: ColumnDef<BareLitzWireSpec, unknown>[] = [
	{
		accessorKey: "equivalentAWG",
		header: ({ column }) => createSortableHeader("AWG", column),
		cell: ({ row }) => formatNumber(row.original.equivalentAWG, 0),
		sortingFn: (rowA, rowB) => {
			const a = Number(rowA.original.equivalentAWG);
			const b = Number(rowB.original.equivalentAWG);
			return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
		},
	},
	{
		accessorKey: "nominalCircularMil",
		header: ({ column }) => createSortableHeader("CIRCULAR MIL", column),
		cell: ({ row }) => formatNumber(row.original.nominalCircularMil, 0),
		sortingFn: (rowA, rowB) => {
			const a = Number(rowA.original.nominalCircularMil);
			const b = Number(rowB.original.nominalCircularMil);
			return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
		},
	},
	{
		accessorKey: "numberOfWires",
		header: ({ column }) => createSortableHeader("# OF WIRES", column),
		cell: ({ row }) => formatNumber(row.original.numberOfWires, 0),
		sortingFn: (rowA, rowB) => {
			const a = Number(rowA.original.numberOfWires);
			const b = Number(rowB.original.numberOfWires);
			return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
		},
	},
	{
		accessorKey: "magnetWireSize",
		header: ({ column }) => createSortableHeader("MAGNET WIRE SIZE", column),
		cell: ({ row }) => formatNumber(row.original.magnetWireSize, 0),
		sortingFn: (rowA, rowB) => {
			const a = Number(rowA.original.magnetWireSize);
			const b = Number(rowB.original.magnetWireSize);
			return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
		},
	},
	{
		accessorKey: "litzWireType",
		header: ({ column }) => createSortableHeader("LITZ WIRE TYPE", column),
	},
	{
		accessorKey: "nominalODIn",
		header: ({ column }) => createSortableHeader("NOMINAL O.D. (IN.)", column),
		cell: ({ row }) => formatNumber(row.original.nominalODIn, 3),
		sortingFn: (rowA, rowB) => {
			const a = Number(rowA.original.nominalODIn);
			const b = Number(rowB.original.nominalODIn);
			return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
		},
	},
	{
		accessorKey: "maxDCResistance",
		header: ({ column }) => createSortableHeader("MAX DC RESISTANCE", column),
		cell: ({ row }) => formatNumber(row.original.maxDCResistance, 5),
		sortingFn: (rowA, rowB) => {
			const a = Number(rowA.original.maxDCResistance);
			const b = Number(rowB.original.maxDCResistance);
			return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
		},
	},
	{
		accessorKey: "nominalLbs1000Ft",
		header: ({ column }) => createSortableHeader("WEIGHT LB/KFT", column),
		cell: ({ row }) => formatNumber(row.original.nominalLbs1000Ft, 3),
		sortingFn: (rowA, rowB) => {
			const a = Number(rowA.original.nominalLbs1000Ft);
			const b = Number(rowB.original.nominalLbs1000Ft);
			return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
		},
	},
	{
		accessorKey: "litzWireConstruction",
		header: ({ column }) => createSortableHeader("CONSTRUCTION", column),
	},
];
