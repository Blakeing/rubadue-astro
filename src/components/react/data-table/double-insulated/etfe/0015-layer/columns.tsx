import type { ColumnDef } from "@tanstack/react-table";

export type WireData = {
	partNumber: string;
	awg: number;
	conductor: {
		inches: number;
		mm: number;
	};
	nominalOD: {
		inches: number;
		mm: number;
	};
	weightLbFt: number;
};

export const columns: ColumnDef<WireData>[] = [
	{
		accessorKey: "partNumber",
		header: "Part Number",
	},
	{
		accessorKey: "awg",
		header: "AWG",
	},
	{
		accessorKey: "conductor.inches",
		header: "Conductor (in)",
		cell: ({ row }) => row.original.conductor.inches.toFixed(4),
	},
	{
		accessorKey: "conductor.mm",
		header: "Conductor (mm)",
		cell: ({ row }) => row.original.conductor.mm.toFixed(3),
	},
	{
		accessorKey: "nominalOD.inches",
		header: "Nominal O.D. (in)",
		cell: ({ row }) => row.original.nominalOD.inches.toFixed(4),
	},
	{
		accessorKey: "nominalOD.mm",
		header: "Nominal O.D. (mm)",
		cell: ({ row }) => row.original.nominalOD.mm.toFixed(3),
	},
	{
		accessorKey: "weightLbFt",
		header: "Weight Lb/Ft",
		cell: ({ row }) => row.original.weightLbFt.toFixed(2),
	},
];
