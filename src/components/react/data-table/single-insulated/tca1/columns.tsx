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
		enableSorting: true,
	},
	{
		accessorKey: "awg",
		header: "AWG",
		enableSorting: true,
		sortingFn: (rowA, rowB) => {
			const a = Number.parseFloat(rowA.getValue("awg")) || 0;
			const b = Number.parseFloat(rowB.getValue("awg")) || 0;
			return a - b;
		},
	},
	{
		header: "CONDUCTOR",
		columns: [
			{
				id: "conductor.inches",
				accessorFn: (row) => row.conductor.inches,
				header: "INCHES",
				enableSorting: true,
				sortingFn: (rowA, rowB) => {
					const a = Number.parseFloat(rowA.getValue("conductor.inches")) || 0;
					const b = Number.parseFloat(rowB.getValue("conductor.inches")) || 0;
					return a - b;
				},
			},
			{
				id: "conductor.mm",
				accessorFn: (row) => row.conductor.mm,
				header: "MM",
				enableSorting: true,
				sortingFn: (rowA, rowB) => {
					const a = Number.parseFloat(rowA.getValue("conductor.mm")) || 0;
					const b = Number.parseFloat(rowB.getValue("conductor.mm")) || 0;
					return a - b;
				},
			},
		],
	},
	{
		header: "NOMINAL O.D.",
		columns: [
			{
				id: "nominalOD.inches",
				accessorFn: (row) => row.nominalOD.inches,
				header: "INCHES",
				enableSorting: true,
				sortingFn: (rowA, rowB) => {
					const a = Number.parseFloat(rowA.getValue("nominalOD.inches")) || 0;
					const b = Number.parseFloat(rowB.getValue("nominalOD.inches")) || 0;
					return a - b;
				},
			},
			{
				id: "nominalOD.mm",
				accessorFn: (row) => row.nominalOD.mm,
				header: "MM",
				enableSorting: true,
				sortingFn: (rowA, rowB) => {
					const a = Number.parseFloat(rowA.getValue("nominalOD.mm")) || 0;
					const b = Number.parseFloat(rowB.getValue("nominalOD.mm")) || 0;
					return a - b;
				},
			},
		],
	},
	{
		accessorKey: "weightLbKft",
		header: "WEIGHT LB/KFT",
		enableSorting: true,
		sortingFn: (rowA, rowB) => {
			const a = Number.parseFloat(rowA.getValue("weightLbKft")) || 0;
			const b = Number.parseFloat(rowB.getValue("weightLbKft")) || 0;
			return a - b;
		},
	},
];
