import { createColumnHelper } from "@tanstack/react-table";

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
			}),
			columnHelper.accessor("conductor.mm", {
				header: "MM",
			}),
		],
	}),
	columnHelper.group({
		header: "NOMINAL O.D.",
		columns: [
			columnHelper.accessor("nominalOD.inches", {
				header: "INCHES",
			}),
			columnHelper.accessor("nominalOD.mm", {
				header: "MM",
			}),
		],
	}),
	columnHelper.accessor("weightLbKft", {
		header: ({ header }) => (header.depth === 0 ? "" : "WEIGHT LB/KFT"),
	}),
];
