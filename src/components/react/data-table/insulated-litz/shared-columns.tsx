import { Button } from "@/components/react/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
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
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						PART NUMBER
						<ChevronsUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
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
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						EQUIVALENT AWG
						<ChevronsUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
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
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						CORE DIAMETER (IN)
						<ChevronsUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
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
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						CIRCULAR MILS
						<ChevronsUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
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
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						NUMBER OF STRANDS
						<ChevronsUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
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
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						AWG OF STRANDS
						<ChevronsUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
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
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						NOMINAL OD (IN)
						<ChevronsUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
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
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						SUGGESTED OPERATING FREQ
						<ChevronsUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
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
