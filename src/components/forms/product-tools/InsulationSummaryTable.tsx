import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import type React from "react";

interface InsulationSummaryTableProps {
	title: string;
	min: { inches: number | null; mm: number | null };
	nom: { inches: number | null; mm: number | null };
	max: { inches: number | null; mm: number | null };
	wallInches?: string | number | null;
	wallMm?: string | number | null;
	nomWallInches?: string | number | null;
	nomWallMm?: string | number | null;
	partNumber: string;
	note?: string;
}

export const InsulationSummaryTable: React.FC<InsulationSummaryTableProps> = ({
	title,
	min,
	nom,
	max,
	wallInches,
	wallMm,
	nomWallInches,
	nomWallMm,
	partNumber,
	note,
}) => {
	const wallDisplay = (
		val: string | number | null | undefined,
		isNom = false,
	) => {
		if (val === null || val === undefined || val === "") {
			if (isNom) {
				return <span className="text-muted-foreground font-semibold">N/A</span>;
			}
			return <span className="text-orange-600 font-bold">CONSULT FACTORY</span>;
		}
		return <span className="text-green-700 font-semibold">{val}</span>;
	};

	const displayValue = (val: number | null | undefined) =>
		val === null || val === undefined || Number.isNaN(val) ? (
			<span className="text-muted-foreground font-semibold">N/A</span>
		) : (
			val.toFixed(3)
		);

	return (
		<div className="mb-6">
			<div className="font-bold text-lg mb-2">{title}</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead rowSpan={2} className="align-middle text-center w-20" />
						<TableHead colSpan={2} className="text-center align-middle w-48">
							Basic Insulation OD's
						</TableHead>
						<TableHead colSpan={2} className="text-center align-middle w-48">
							Insulation Wall/Layer
						</TableHead>
					</TableRow>
					<TableRow>
						<TableHead className="text-center w-24">Inches</TableHead>
						<TableHead className="text-center w-24">mm</TableHead>
						<TableHead className="text-center w-24">Inches</TableHead>
						<TableHead className="text-center w-24">mm</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableHead className="text-center align-middle">Min</TableHead>
						<TableCell className="text-center align-middle">
							{displayValue(min.inches)}
						</TableCell>
						<TableCell className="text-center align-middle">
							{displayValue(min.mm)}
						</TableCell>
						<TableCell colSpan={2} className="text-center align-middle">
							{wallDisplay(null)}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableHead className="text-center align-middle">Nom</TableHead>
						<TableCell className="text-center align-middle">
							{displayValue(nom.inches)}
						</TableCell>
						<TableCell className="text-center align-middle">
							{displayValue(nom.mm)}
						</TableCell>
						<TableCell className="text-center align-middle">
							{wallDisplay(nomWallInches, true)}
						</TableCell>
						<TableCell className="text-center align-middle">
							{wallDisplay(nomWallMm, true)}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableHead className="text-center align-middle">Max</TableHead>
						<TableCell className="text-center align-middle">
							{displayValue(max.inches)}
						</TableCell>
						<TableCell className="text-center align-middle">
							{displayValue(max.mm)}
						</TableCell>
						<TableCell colSpan={2} className="text-center align-middle">
							{wallDisplay(null)}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
			<div className="mt-2 font-mono text-sm">
				<span className="font-semibold">Rubadue Part Number:</span> {partNumber}
			</div>
			{note && (
				<div className="mt-1 text-xs text-muted-foreground italic">{note}</div>
			)}
		</div>
	);
};
