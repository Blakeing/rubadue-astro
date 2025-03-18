import { Button } from "@/components/react/ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { BareLitzWireSpec } from "./data";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";

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
		header: ({ column }) => {
			const isSorted = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(isSorted === "asc")}
					className="hover:bg-muted/50"
				>
					AWG
					<ArrowUpDown
						className={cn("ml-2 h-4 w-4", isSorted && "text-primary")}
					/>
				</Button>
			);
		},
		cell: ({ row }) => formatNumber(row.original.equivalentAWG, 0),
		sortingFn: (rowA, rowB) => {
			const a = Number(rowA.original.equivalentAWG);
			const b = Number(rowB.original.equivalentAWG);
			return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
		},
	},
	{
		accessorKey: "nominalCircularMil",
		header: ({ column }) => {
			const isSorted = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(isSorted === "asc")}
					className="hover:bg-muted/50"
				>
					CIRCULAR MIL
					<ArrowUpDown
						className={cn("ml-2 h-4 w-4", isSorted && "text-primary")}
					/>
				</Button>
			);
		},
		cell: ({ row }) => formatNumber(row.original.nominalCircularMil, 0),
		sortingFn: (rowA, rowB) => {
			const a = Number(rowA.original.nominalCircularMil);
			const b = Number(rowB.original.nominalCircularMil);
			return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
		},
	},
	{
		accessorKey: "numberOfWires",
		header: ({ column }) => {
			const isSorted = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(isSorted === "asc")}
					className="hover:bg-muted/50"
				>
					# OF WIRES
					<ArrowUpDown
						className={cn("ml-2 h-4 w-4", isSorted && "text-primary")}
					/>
				</Button>
			);
		},
		cell: ({ row }) => formatNumber(row.original.numberOfWires, 0),
		sortingFn: (rowA, rowB) => {
			const a = Number(rowA.original.numberOfWires);
			const b = Number(rowB.original.numberOfWires);
			return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
		},
	},
	{
		accessorKey: "magnetWireSize",
		header: ({ column }) => {
			const isSorted = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(isSorted === "asc")}
					className="hover:bg-muted/50"
				>
					MAGNET WIRE SIZE
					<ArrowUpDown
						className={cn("ml-2 h-4 w-4", isSorted && "text-primary")}
					/>
				</Button>
			);
		},
		cell: ({ row }) => formatNumber(row.original.magnetWireSize, 0),
		sortingFn: (rowA, rowB) => {
			const a = Number(rowA.original.magnetWireSize);
			const b = Number(rowB.original.magnetWireSize);
			return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
		},
	},
	{
		accessorKey: "litzWireType",
		header: ({ column }) => {
			const isSorted = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(isSorted === "asc")}
					className="hover:bg-muted/50"
				>
					LITZ WIRE TYPE
					<ArrowUpDown
						className={cn("ml-2 h-4 w-4", isSorted && "text-primary")}
					/>
				</Button>
			);
		},
	},
	{
		accessorKey: "nominalODIn",
		header: ({ column }) => {
			const isSorted = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(isSorted === "asc")}
					className="hover:bg-muted/50"
				>
					NOMINAL O.D. (IN.)
					<ArrowUpDown
						className={cn("ml-2 h-4 w-4", isSorted && "text-primary")}
					/>
				</Button>
			);
		},
		cell: ({ row }) => formatNumber(row.original.nominalODIn, 3),
		sortingFn: (rowA, rowB) => {
			const a = Number(rowA.original.nominalODIn);
			const b = Number(rowB.original.nominalODIn);
			return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
		},
	},
	{
		accessorKey: "maxDCResistance",
		header: ({ column }) => {
			const isSorted = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(isSorted === "asc")}
					className="hover:bg-muted/50"
				>
					MAX DC RESISTANCE
					<ArrowUpDown
						className={cn("ml-2 h-4 w-4", isSorted && "text-primary")}
					/>
				</Button>
			);
		},
		cell: ({ row }) => formatNumber(row.original.maxDCResistance, 5),
		sortingFn: (rowA, rowB) => {
			const a = Number(rowA.original.maxDCResistance);
			const b = Number(rowB.original.maxDCResistance);
			return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
		},
	},
	{
		accessorKey: "nominalLbs1000Ft",
		header: ({ column }) => {
			const isSorted = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(isSorted === "asc")}
					className="hover:bg-muted/50"
				>
					WEIGHT LB/KFT
					<ArrowUpDown
						className={cn("ml-2 h-4 w-4", isSorted && "text-primary")}
					/>
				</Button>
			);
		},
		cell: ({ row }) => formatNumber(row.original.nominalLbs1000Ft, 3),
		sortingFn: (rowA, rowB) => {
			const a = Number(rowA.original.nominalLbs1000Ft);
			const b = Number(rowB.original.nominalLbs1000Ft);
			return Number.isNaN(a) || Number.isNaN(b) ? 0 : a - b;
		},
	},
	{
		accessorKey: "litzWireConstruction",
		header: ({ column }) => {
			const isSorted = column.getIsSorted();
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(isSorted === "asc")}
					className="hover:bg-muted/50"
				>
					CONSTRUCTION
					<ArrowUpDown
						className={cn("ml-2 h-4 w-4", isSorted && "text-primary")}
					/>
				</Button>
			);
		},
	},
];
