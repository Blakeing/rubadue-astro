import type { ColumnDef } from "@tanstack/react-table";
import type { WireData } from "@/components/react/data-table/types";

export const columns: ColumnDef<WireData>[] = [
	{
		accessorKey: "partNumber",
		header: "PART NUMBER",
	},
	{
		accessorKey: "awg",
		header: "AWG",
	},
	{
		header: "CONDUCTOR",
		columns: [
			{
				accessorKey: "conductor.inches",
				header: "INCHES",
				cell: ({ row }) => {
					const value = row.original.conductor.inches;
					return typeof value === "number" ? value.toFixed(4) : value;
				},
			},
			{
				accessorKey: "conductor.mm",
				header: "MM",
				cell: ({ row }) => {
					const value = row.original.conductor.mm;
					return typeof value === "number" ? value.toFixed(3) : value;
				},
			},
		],
	},
	{
		header: "NOMINAL O.D.",
		columns: [
			{
				accessorKey: "nominalOD.inches",
				header: "INCHES",
				cell: ({ row }) => {
					const value = row.original.nominalOD.inches;
					return typeof value === "number" ? value.toFixed(4) : value;
				},
			},
			{
				accessorKey: "nominalOD.mm",
				header: "MM",
				cell: ({ row }) => {
					const value = row.original.nominalOD.mm;
					return typeof value === "number" ? value.toFixed(3) : value;
				},
			},
		],
	},
	{
		accessorKey: "weightLbKft",
		header: "WEIGHT LB/KFT",
		cell: ({ row }) => {
			const value = row.original.weightLbKft;
			return typeof value === "number" ? value.toFixed(2) : value;
		},
	},
];
