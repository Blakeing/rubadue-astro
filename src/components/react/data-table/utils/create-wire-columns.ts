import type { ColumnDef } from "@tanstack/react-table";
import type {
	WireData,
	WireDataBase,
	WireDataWithKft,
	WireDataWithFt,
} from "@/types/wire-data";

interface CreateWireColumnsOptions {
	/** Whether to format numeric values with fixed decimal places */
	formatNumeric?: boolean;
	/** Whether to use Kft (thousands of feet) for weight units */
	useKft?: boolean;
}

/**
 * Safely converts a value to a number and formats it with the specified decimal places
 * @param value The value to format
 * @param decimals The number of decimal places
 * @returns The formatted number or an empty string if the value is invalid
 */
function formatNumber(
	value: string | number | undefined | null,
	decimals: number,
): string {
	if (value === undefined || value === null || value === "") {
		return "";
	}
	const num = typeof value === "string" ? Number.parseFloat(value) : value;
	return Number.isNaN(num) ? "" : num.toFixed(decimals);
}

/**
 * Creates common wire data table columns with consistent sorting and formatting
 * @param options Configuration options
 * @returns Array of column definitions
 */
export function createWireColumns<T extends WireData>(
	options: CreateWireColumnsOptions = {},
): ColumnDef<T>[] {
	const { formatNumeric = false, useKft = true } = options;

	return [
		{
			id: "partNumber",
			accessorKey: "partNumber",
			header: ({ header }) => (header.depth === 0 ? "" : "PART NUMBER"),
			sortingFn: "alphanumeric",
		},
		{
			id: "awg",
			accessorKey: "awg",
			header: ({ header }) => (header.depth === 0 ? "" : "AWG"),
			sortingFn: (rowA, rowB) => {
				const a = Number.parseFloat(String(rowA.getValue("awg"))) || 0;
				const b = Number.parseFloat(String(rowB.getValue("awg"))) || 0;
				return a - b;
			},
		},
		{
			id: "conductor",
			header: "CONDUCTOR",
			columns: [
				{
					id: "conductor.inches",
					accessorKey: "conductor.inches",
					header: "INCHES",
					cell: formatNumeric
						? ({ row }) => formatNumber(row.original.conductor.inches, 4)
						: undefined,
					sortingFn: (rowA, rowB) => {
						const a =
							Number.parseFloat(String(rowA.getValue("conductor.inches"))) || 0;
						const b =
							Number.parseFloat(String(rowB.getValue("conductor.inches"))) || 0;
						return a - b;
					},
				},
				{
					id: "conductor.mm",
					accessorKey: "conductor.mm",
					header: "MM",
					cell: formatNumeric
						? ({ row }) => formatNumber(row.original.conductor.mm, 3)
						: undefined,
					sortingFn: (rowA, rowB) => {
						const a =
							Number.parseFloat(String(rowA.getValue("conductor.mm"))) || 0;
						const b =
							Number.parseFloat(String(rowB.getValue("conductor.mm"))) || 0;
						return a - b;
					},
				},
			],
		},
		{
			id: "nominalOD",
			header: "NOMINAL O.D.",
			columns: [
				{
					id: "nominalOD.inches",
					accessorKey: "nominalOD.inches",
					header: "INCHES",
					cell: formatNumeric
						? ({ row }) => formatNumber(row.original.nominalOD.inches, 4)
						: undefined,
					sortingFn: (rowA, rowB) => {
						const a =
							Number.parseFloat(String(rowA.getValue("nominalOD.inches"))) || 0;
						const b =
							Number.parseFloat(String(rowB.getValue("nominalOD.inches"))) || 0;
						return a - b;
					},
				},
				{
					id: "nominalOD.mm",
					accessorKey: "nominalOD.mm",
					header: "MM",
					cell: formatNumeric
						? ({ row }) => formatNumber(row.original.nominalOD.mm, 3)
						: undefined,
					sortingFn: (rowA, rowB) => {
						const a =
							Number.parseFloat(String(rowA.getValue("nominalOD.mm"))) || 0;
						const b =
							Number.parseFloat(String(rowB.getValue("nominalOD.mm"))) || 0;
						return a - b;
					},
				},
			],
		},
		{
			id: useKft ? "weightLbKft" : "weightLbFt",
			accessorKey: useKft ? "weightLbKft" : "weightLbFt",
			header: ({ header }) =>
				header.depth === 0 ? "" : useKft ? "WEIGHT LB/KFT" : "WEIGHT LB/FT",
			cell: formatNumeric
				? ({ row }) => {
						const value = useKft
							? (row.original as WireDataWithKft).weightLbKft
							: (row.original as WireDataWithFt).weightLbFt;
						return formatNumber(value, 2);
					}
				: undefined,
			sortingFn: (rowA, rowB) => {
				const key = useKft ? "weightLbKft" : "weightLbFt";
				const a = Number.parseFloat(String(rowA.getValue(key))) || 0;
				const b = Number.parseFloat(String(rowB.getValue(key))) || 0;
				return a - b;
			},
		},
	];
}
