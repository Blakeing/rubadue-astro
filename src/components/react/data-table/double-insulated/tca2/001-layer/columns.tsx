import type { ColumnDef } from "@tanstack/react-table";
import type { WireData } from "./types";

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
				cell: ({ row }) => row.original.conductor.inches.toFixed(4),
			},
			{
				accessorKey: "conductor.mm",
				header: "MM",
				cell: ({ row }) => row.original.conductor.mm.toFixed(3),
			},
		],
	},
	{
		header: "NOMINAL O.D.",
		columns: [
			{
				accessorKey: "nominalOD.inches",
				header: "INCHES",
				cell: ({ row }) => row.original.nominalOD.inches.toFixed(4),
			},
			{
				accessorKey: "nominalOD.mm",
				header: "MM",
				cell: ({ row }) => row.original.nominalOD.mm.toFixed(3),
			},
		],
	},
	{
		accessorKey: "weightLbFt",
		header: "WEIGHT LB/FT",
		cell: ({ row }) => row.original.weightLbFt.toFixed(2),
	},
];
