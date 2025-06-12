import { Button } from "@/components/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { createSortableHeader } from "../utils/sorting";
import type { InsulatedLitzSpec } from "./types";

const formatNumber = (value: string | number | null | undefined): string => {
	if (value == null) return "";
	if (typeof value === "string") {
		const num = Number(value);
		return Number.isNaN(num) ? value : num.toLocaleString();
	}
	return value.toLocaleString();
};

export function createInsulatedLitzColumns<
	T extends InsulatedLitzSpec,
>(): ColumnDef<T, unknown>[] {
	return [
		{
			accessorKey: "partNumber",
			header: ({ column }) => createSortableHeader("PART NUMBER", column),
			cell: ({ row }) => (
				<div className="w-[100px]">{row.getValue("partNumber")}</div>
			),
			sortingFn: (rowA, rowB) => {
				const a = rowA.original.partNumber;
				const b = rowB.original.partNumber;
				return a.localeCompare(b);
			},
		},
		{
			accessorKey: "equivalentAWG",
			header: ({ column }) => createSortableHeader("EQUIVALENT AWG", column),
			cell: ({ row }) => (
				<div className="w-[100px]">
					{formatNumber(row.getValue("equivalentAWG"))}
				</div>
			),
			sortingFn: (rowA, rowB) => {
				const a = rowA.original.equivalentAWG;
				const b = rowB.original.equivalentAWG;
				return a == null || b == null ? 0 : Number(a) - Number(b);
			},
		},
		{
			accessorKey: "coreDiameter",
			header: ({ column }) =>
				createSortableHeader("CORE DIAMETER (IN)", column),
			cell: ({ row }) => (
				<div className="w-[100px]">
					{formatNumber(row.getValue("coreDiameter"))}
				</div>
			),
			sortingFn: (rowA, rowB) => {
				const a = rowA.original.coreDiameter;
				const b = rowB.original.coreDiameter;
				return a == null || b == null ? 0 : Number(a) - Number(b);
			},
		},
		{
			accessorKey: "circularMils",
			header: ({ column }) => createSortableHeader("CIRCULAR MILS", column),
			cell: ({ row }) => (
				<div className="w-[100px]">
					{formatNumber(row.getValue("circularMils"))}
				</div>
			),
			sortingFn: (rowA, rowB) => {
				const a = rowA.original.circularMils;
				const b = rowB.original.circularMils;
				return a == null || b == null ? 0 : Number(a) - Number(b);
			},
		},
		{
			accessorKey: "numberOfStrands",
			header: ({ column }) => createSortableHeader("NUMBER OF STRANDS", column),
			cell: ({ row }) => (
				<div className="w-[100px]">
					{formatNumber(row.getValue("numberOfStrands"))}
				</div>
			),
			sortingFn: (rowA, rowB) => {
				const a = rowA.original.numberOfStrands;
				const b = rowB.original.numberOfStrands;
				return a == null || b == null ? 0 : Number(a) - Number(b);
			},
		},
		{
			accessorKey: "awgOfStrands",
			header: ({ column }) => createSortableHeader("AWG OF STRANDS", column),
			cell: ({ row }) => (
				<div className="w-[100px]">
					{formatNumber(row.getValue("awgOfStrands"))}
				</div>
			),
			sortingFn: (rowA, rowB) => {
				const a = rowA.original.awgOfStrands;
				const b = rowB.original.awgOfStrands;
				return a == null || b == null ? 0 : Number(a) - Number(b);
			},
		},
		{
			accessorKey: "nominalOD",
			header: ({ column }) => createSortableHeader("NOMINAL OD (IN)", column),
			cell: ({ row }) => (
				<div className="w-[100px]">
					{formatNumber(row.getValue("nominalOD"))}
				</div>
			),
			sortingFn: (rowA, rowB) => {
				const a = rowA.original.nominalOD;
				const b = rowB.original.nominalOD;
				return a == null || b == null ? 0 : Number(a) - Number(b);
			},
		},
		{
			accessorKey: "suggestedOperatingFreq",
			header: ({ column }) =>
				createSortableHeader("SUGGESTED OPERATING FREQ", column),
			cell: ({ row }) => (
				<div className="w-[100px]">
					{row.getValue("suggestedOperatingFreq")}
				</div>
			),
			sortingFn: (rowA, rowB) => {
				const a = rowA.original.suggestedOperatingFreq;
				const b = rowB.original.suggestedOperatingFreq;
				return a == null || b == null ? 0 : a.localeCompare(b);
			},
		},
	];
}
