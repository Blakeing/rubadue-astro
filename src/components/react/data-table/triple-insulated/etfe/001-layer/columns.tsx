import type { ColumnDef } from "@tanstack/react-table";

export type WireData = {
	partNumber: string;
	awg: string;
	conductor: {
		inches: string;
		mm: string;
	};
	nominalOD: {
		inches: string;
		mm: string;
	};
	weightLbKft: string;
};

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
			},
			{
				accessorKey: "conductor.mm",
				header: "MM",
			},
		],
	},
	{
		header: "NOMINAL O.D.",
		columns: [
			{
				accessorKey: "nominalOD.inches",
				header: "INCHES",
			},
			{
				accessorKey: "nominalOD.mm",
				header: "MM",
			},
		],
	},
	{
		accessorKey: "weightLbKft",
		header: "WEIGHT LB/KFT",
	},
];
