import { createColumnHelper } from "@tanstack/react-table";
import type { WireData } from "./types";

const columnHelper = createColumnHelper<WireData>();

export const columns = [
	columnHelper.accessor("partNumber", {
		header: ({ header }) => (header.depth === 0 ? "" : "PART NUMBER"),
	}),
	columnHelper.accessor("awg", {
		header: ({ header }) => (header.depth === 0 ? "" : "AWG"),
	}),
	columnHelper.group({
		header: "CONDUCTOR",
		columns: [
			columnHelper.accessor("conductor.inches", {
				header: "INCHES",
				cell: ({ row }) => row.original.conductor.inches.toFixed(4),
			}),
			columnHelper.accessor("conductor.mm", {
				header: "MM",
				cell: ({ row }) => row.original.conductor.mm.toFixed(3),
			}),
		],
	}),
	columnHelper.group({
		header: "NOMINAL O.D.",
		columns: [
			columnHelper.accessor("nominalOD.inches", {
				header: "INCHES",
				cell: ({ row }) => row.original.nominalOD.inches.toFixed(4),
			}),
			columnHelper.accessor("nominalOD.mm", {
				header: "MM",
				cell: ({ row }) => row.original.nominalOD.mm.toFixed(3),
			}),
		],
	}),
	columnHelper.accessor("weightLbFt", {
		header: ({ header }) => (header.depth === 0 ? "" : "WEIGHT LB/FT"),
		cell: ({ row }) => row.original.weightLbFt.toFixed(2),
	}),
];
