import * as bareLitzData from "@/components/data-display/product-tables/bare-litz/data";
import type { BareLitzWireSpec } from "@/components/data-display/product-tables/bare-litz/data";
import { InputField, SelectField } from "@/components/ui/FormFields";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const awgOptions = Array.from({ length: 40 - 12 + 1 }, (_, i) => {
	const awg = (i + 12).toString();
	return { value: awg, label: `${awg} AWG` };
});

// Max strand counts per AWG (from provided table)
const maxStrandsByAwg: Record<string, number> = {
	"12": 8,
	"13": 8,
	"14": 8,
	"15": 8,
	"16": 8,
	"17": 8,
	"18": 8,
	"19": 8,
	"20": 8,
	"21": 8,
	"22": 8,
	"23": 9,
	"24": 11,
	"25": 15,
	"26": 19,
	"27": 23,
	"28": 29,
	"29": 37,
	"30": 47,
	"31": 60,
	"32": 66,
	"33": 66,
	"34": 66,
	"35": 66,
	"36": 66,
	"37": 66,
	"38": 66,
	"39": 66,
	"40": 66,
	"41": 66,
	"42": 66,
	"43": 66,
	"44": 66,
	"45": 66,
	"46": 66,
	"47": 21,
	"48": 21,
	"49": 21,
	"50": 21,
};

// Helper: recursively check divisibility by 5, 3, 4
function getDivisibilityBreakdown(
	n: number,
	awg: string,
	path: number[] = [],
): { valid: boolean; path: number[] } {
	const max = maxStrandsByAwg[awg] || 0;
	if (n <= max) return { valid: true, path: [...path, n] };
	for (const d of [5, 3, 4]) {
		if (n % d === 0) {
			const next = n / d;
			const result = getDivisibilityBreakdown(next, awg, [...path, n]);
			if (result.valid) return result;
		}
	}
	return { valid: false, path: [...path, n] };
}

// Helper: special rule for 12–22 AWG
function isSpecialRuleValid(n: number, awg: string) {
	const awgNum = Number.parseInt(awg, 10);
	return awgNum >= 12 && awgNum <= 22 && n <= 8;
}

// Helper: get nearby valid counts
function getNearbyValidCounts(center: number, awg: string, range = 15) {
	const arr = [];
	for (let i = center - range; i <= center + range; i++) {
		if (i < 1) continue;
		const special = isSpecialRuleValid(i, awg);
		const { valid } = getDivisibilityBreakdown(i, awg);
		arr.push({
			value: i,
			valid: valid || special,
		});
	}
	return arr;
}

type LitzType = "Type 1" | "Type 2";
const litzTypeDefaults: Record<LitzType, { packing: number; takeup: number }> =
	{
		"Type 1": { packing: 1.18, takeup: 1.03 },
		"Type 2": { packing: 1.236, takeup: 1.03 },
	};
const litzTypeOptions = [
	{ value: "Type 1", label: "Type 1" },
	{ value: "Type 2", label: "Type 2" },
];

const wireTypeOptions = [
	{ value: "bare", label: "Bare & Served Litz Wires" },
	{ value: "insulated", label: "Insulated Litz Wires" },
];
const magnetWireGrades = [
	{ value: "MW 79-C", label: "MW 79-C" },
	{ value: "MW 80-C", label: "MW 80-C" },
	{ value: "MW 35-C", label: "MW 35-C" },
];
const insulationTypes = [
	{ value: "ETFE", label: "ETFE" },
	{ value: "FEP", label: "FEP" },
	{ value: "PFA", label: "PFA" },
];

// Utility to find a matching bare litz spec
function findBareLitzSpec(
	strands: number,
	awg: string,
	magnetGrade: string,
): BareLitzWireSpec | undefined {
	// Flatten all arrays in bareLitzData and filter only valid BareLitzWireSpec
	const allSpecs: BareLitzWireSpec[] = Object.values(bareLitzData)
		.flat()
		.filter((item: unknown): item is BareLitzWireSpec => {
			if (!item || typeof item !== "object") return false;
			const obj = item as Record<string, unknown>;
			return (
				typeof obj.numberOfWires === "string" &&
				typeof obj.magnetWireSize === "string"
			);
		});
	// Try to match by numberOfWires and magnetWireSize (AWG)
	return allSpecs.find(
		(spec) =>
			Number(spec.numberOfWires) === strands &&
			String(spec.magnetWireSize) === String(awg),
	);
}

// Utility for insulation wall thickness (example values, update as needed)
const insulationWallTable: Record<
	string,
	{ single: number | null; double: number | null; triple: number | null }
> = {
	ETFE: { single: 0.0065, double: 0.0035, triple: 0.0025 },
	FEP: { single: 0.0065, double: 0.0035, triple: 0.0025 },
	PFA: { single: 0.0055, double: 0.003, triple: 0.002 },
};

function getInsulationWall(
	insType: string,
	layers: "single" | "double" | "triple",
): number | null {
	return insulationWallTable[insType]?.[layers] ?? null;
}

function getInsulatedWarning(
	insType: string,
	layers: "single" | "double" | "triple",
	awg: string,
): string | null {
	if (
		insType === "PFA" &&
		layers === "single" &&
		Number.parseInt(awg, 10) > 22
	) {
		return "THIS PART WILL NOT CARRY UL APPROVALS. CONSIDER FEP INSULATION OR SUPPLEMENTAL/REINFORCED INSULATION.";
	}
	return null;
}

// Film/serve types and their part number suffixes
const filmServeTypes = [
	{ label: "Single Film - Bare Litz", key: "singleBare", partSuffix: "S" },
	{
		label: "Single Film - Single Nylon Serve",
		key: "singleSN",
		partSuffix: "S-SN",
	},
	{
		label: "Single Film - Double Nylon Serve",
		key: "singleDN",
		partSuffix: "S-DN",
	},
	{ label: "Heavy Film - Bare Litz", key: "heavyBare", partSuffix: "H" },
	{
		label: "Heavy Film - Single Nylon Serve",
		key: "heavySN",
		partSuffix: "H-SN",
	},
	{
		label: "Heavy Film - Double Nylon Serve",
		key: "heavyDN",
		partSuffix: "H-DN",
	},
	{ label: "Triple Film - Bare Litz", key: "tripleBare", partSuffix: "T" },
	{
		label: "Triple Film - Single Nylon Serve",
		key: "tripleSN",
		partSuffix: "T-SN",
	},
	{
		label: "Triple Film - Double Nylon Serve",
		key: "tripleDN",
		partSuffix: "T-DN",
	},
	{ label: "Quadruple Film - Bare Litz", key: "quadBare", partSuffix: "Q" },
	{
		label: "Quad Film - Single Nylon Serve",
		key: "quadSN",
		partSuffix: "Q-SN",
	},
	{
		label: "Quad Film - Double Nylon Serve",
		key: "quadDN",
		partSuffix: "Q-DN",
	},
];

// Example reference data for diameters (inches) for each type, update as needed
const filmServeDiameters: Record<
	string,
	{ min: number; nom: number; max: number } | undefined
> = {
	singleBare: { min: 0.087, nom: 0.091, max: 0.095 },
	singleSN: { min: 0.089, nom: 0.093, max: 0.098 },
	singleDN: { min: 0.091, nom: 0.095, max: 0.101 },
	heavyBare: { min: 0.093, nom: 0.098, max: 0.103 },
	heavySN: { min: 0.095, nom: 0.1, max: 0.106 },
	heavyDN: { min: 0.097, nom: 0.102, max: 0.109 },
	tripleBare: { min: 0.098, nom: 0.105, max: 0.109 },
	tripleSN: { min: 0.1, nom: 0.107, max: 0.112 },
	tripleDN: { min: 0.102, nom: 0.109, max: 0.115 },
	quadBare: { min: 0.106, nom: 0.111, max: 0.116 },
	quadSN: { min: 0.108, nom: 0.113, max: 0.119 },
	quadDN: { min: 0.11, nom: 0.115, max: 0.122 },
};

export default function LitzDesignToolForm() {
	const form = useForm({
		defaultValues: {
			strands: "",
			awg: "22",
			litzType: "Type 1",
			packingFactor: litzTypeDefaults["Type 1"].packing,
			takeUpFactor: litzTypeDefaults["Type 1"].takeup,
			wireType: "bare",
			magnetGrade: "MW 79-C",
			insulationType: "ETFE",
		},
		mode: "onChange",
	});
	const { control, watch, setValue } = form;
	const strands = watch("strands");
	const awg = watch("awg");
	const litzType = (watch("litzType") as LitzType) || "Type 1";
	const packingFactor = watch("packingFactor");
	const takeUpFactor = watch("takeUpFactor");
	const wireType = watch("wireType") || "bare";
	const magnetGrade = watch("magnetGrade") || "MW 79-C";
	const insulationType = watch("insulationType") || "ETFE";

	// Placeholder for results logic
	const [results] = useState({
		isValid: false,
		nearby: [],
		breakdown: [],
	});

	const strandsNum = Number.parseInt(strands, 10);
	const awgNum = awg;

	const resultsMemo = useMemo(() => {
		if (!strandsNum || !awgNum)
			return {
				isValid: false,
				nearby: [],
				breakdown: [],
				specialRule: false,
			};
		const specialRule = isSpecialRuleValid(strandsNum, awgNum);
		const breakdownResult = getDivisibilityBreakdown(strandsNum, awgNum);
		const isValid = breakdownResult.valid || specialRule;
		const nearby = getNearbyValidCounts(strandsNum, awgNum, 10);
		return {
			isValid,
			nearby,
			breakdown: breakdownResult.path,
			specialRule,
		};
	}, [strandsNum, awgNum]);

	// Update packing/takeup factor defaults when litzType changes
	useEffect(() => {
		setValue("packingFactor", litzTypeDefaults[litzType]?.packing ?? 1.18);
		setValue("takeUpFactor", litzTypeDefaults[litzType]?.takeup ?? 1.03);
	}, [litzType, setValue]);

	// Calculate copper area
	function getAwgAreaCMA(awg: string) {
		// Standard AWG table (CMA)
		const awgCmaTable: Record<string, number> = {
			"12": 6530,
			"13": 5180,
			"14": 4107,
			"15": 3260,
			"16": 2583,
			"17": 2048,
			"18": 1624,
			"19": 1288,
			"20": 1022,
			"21": 810,
			"22": 642,
			"23": 509,
			"24": 404,
			"25": 320,
			"26": 254,
			"27": 202,
			"28": 160,
			"29": 127,
			"30": 101,
			"31": 80,
			"32": 64,
			"33": 51,
			"34": 40,
			"35": 32,
			"36": 25,
			"37": 20,
			"38": 16,
			"39": 13,
			"40": 10,
			"41": 8,
			"42": 6,
			"43": 5,
			"44": 4,
			"45": 3,
			"46": 2,
			"47": 2,
			"48": 1,
			"49": 1,
			"50": 1,
		};
		return awgCmaTable[awg] || 0;
	}
	const totalCMA =
		strandsNum && awgNum ? strandsNum * getAwgAreaCMA(awgNum) : 0;
	const totalMM2 = totalCMA ? totalCMA * 0.0005067 : 0;

	return (
		<div className="grid gap-6 grid-cols-1 md:grid-cols-5">
			<Card className="md:col-span-2">
				<CardContent className="pt-6">
					<Form {...form}>
						<form className="space-y-4">
							<InputField
								control={control}
								name="strands"
								label="Number of Strands"
								placeholder="Enter number of strands"
								type="number"
								min={1}
								required
							/>
							<SelectField
								control={control}
								name="awg"
								label="AWG Size"
								placeholder="Select AWG size"
								options={awgOptions}
								required
							/>
							{/* Step 2: Construction Details */}
							<div className="space-y-2">
								<Label>Litz Type</Label>
								<Select
									value={litzType}
									onValueChange={(val) => setValue("litzType", val as LitzType)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select Litz Type" />
									</SelectTrigger>
									<SelectContent>
										{litzTypeOptions.map((opt) => (
											<SelectItem key={opt.value} value={opt.value}>
												{opt.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<InputField
								control={control}
								name="packingFactor"
								label="Packing Factor (OD)"
								type="number"
								step={0.001}
								min={1}
								required
							/>
							<InputField
								control={control}
								name="takeUpFactor"
								label="Take Up Factor (WT)"
								type="number"
								step={0.001}
								min={1}
								required
							/>
							<hr className="my-6" />
							{/* Step 3: Wire Type Selection */}
							<SelectField
								control={control}
								name="wireType"
								label="Wire Type"
								placeholder="Select Wire Type"
								options={wireTypeOptions}
								required
							/>
							{wireType === "bare" && (
								<div className="space-y-2">
									<SelectField
										control={control}
										name="magnetGrade"
										label="Magnet Wire Grade"
										placeholder="Select Magnet Wire Grade"
										options={magnetWireGrades}
										required
									/>
								</div>
							)}
							{wireType === "insulated" && (
								<div className="space-y-2">
									<SelectField
										control={control}
										name="magnetGrade"
										label="Magnet Wire Grade"
										placeholder="Select Magnet Wire Grade"
										options={magnetWireGrades}
										required
									/>
									<SelectField
										control={control}
										name="insulationType"
										label="Insulation Type"
										placeholder="Select Insulation Type"
										options={insulationTypes}
										required
									/>
								</div>
							)}
						</form>
					</Form>
				</CardContent>
			</Card>
			<Card className="md:col-span-3">
				<CardContent className="pt-6">
					<div className="space-y-8">
						{/* Strand Validation Results */}
						<div>
							<h3 className="font-semibold">Strand Validation Results</h3>
							<div className="text-muted-foreground text-sm">
								<p>
									Is valid:{" "}
									<span className="font-mono">
										{resultsMemo.isValid ? "Yes" : "No"}
									</span>
								</p>
								{resultsMemo.specialRule && (
									<p className="text-xs text-green-700">
										Valid by special rule: ≤8 strands for AWG 12–22
									</p>
								)}
								<p className="mt-2">Nearby valid counts:</p>
								<div className="flex flex-wrap gap-1">
									{resultsMemo.nearby.map(({ value, valid }) => (
										<span
											key={value}
											className={`px-2 py-0.5 rounded text-xs font-mono ${valid ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}
										>
											{value}
										</span>
									))}
								</div>
								<p className="mt-2">Breakdown path:</p>
								<div className="flex flex-wrap gap-1">
									{resultsMemo.breakdown.map((n) => (
										<span
											key={n}
											className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-mono"
										>
											{n}
										</span>
									))}
								</div>
							</div>
						</div>
						{/* Construction Details Output */}
						<div>
							<h3 className="font-semibold">Construction Details</h3>
							<div className="text-muted-foreground text-sm space-y-1">
								<p>
									Total Wires:{" "}
									<span className="font-mono">{strandsNum || "-"}</span>
								</p>
								<p>
									Wire AWG: <span className="font-mono">{awgNum || "-"}</span>
								</p>
								<p>
									Litz Type: <span className="font-mono">{litzType}</span>
								</p>
								<p>
									Packing Factor (OD):{" "}
									<span className="font-mono">{packingFactor}</span>
								</p>
								<p>
									Take Up Factor (WT):{" "}
									<span className="font-mono">{takeUpFactor}</span>
								</p>
								<p>
									Total Copper Area (CMA):{" "}
									<span className="font-mono">
										{totalCMA ? totalCMA.toLocaleString() : "-"}
									</span>
								</p>
								<p>
									Total Copper Area (mm²):{" "}
									<span className="font-mono">
										{totalMM2 ? totalMM2.toFixed(2) : "-"}
									</span>
								</p>
							</div>
						</div>
						{/* Wire Type Results Output */}
						<div>
							<h3 className="font-semibold">Wire Type Results</h3>
							{wireType === "bare" &&
								(strandsNum && awgNum ? (
									<div className="overflow-x-auto">
										<table className="min-w-full text-xs border mb-2">
											<thead>
												<tr className="bg-muted">
													<th className="px-2 py-1 border">Type</th>
													<th className="px-2 py-1 border">Min OD (in)</th>
													<th className="px-2 py-1 border">Nom OD (in)</th>
													<th className="px-2 py-1 border">Max OD (in)</th>
													<th className="px-2 py-1 border">Part Number</th>
												</tr>
											</thead>
											<tbody>
												{filmServeTypes.map((type) => {
													const diam = filmServeDiameters[type.key];
													const partNumber = `RL-${strandsNum}-${awgNum}${type.partSuffix}${magnetGrade.replace(/[^0-9]/g, "")}-XX`;
													return (
														<tr key={type.key}>
															<td className="px-2 py-1 border font-semibold">
																{type.label}
															</td>
															<td className="px-2 py-1 border">
																{diam ? diam.min.toFixed(3) : "-"}
															</td>
															<td className="px-2 py-1 border">
																{diam ? diam.nom.toFixed(3) : "-"}
															</td>
															<td className="px-2 py-1 border">
																{diam ? diam.max.toFixed(3) : "-"}
															</td>
															<td className="px-2 py-1 border font-mono">
																{partNumber}
															</td>
														</tr>
													);
												})}
											</tbody>
										</table>
									</div>
								) : (
									<div className="text-xs text-gray-600">
										Enter number of strands and AWG to see results.
									</div>
								))}
							{wireType === "insulated" &&
								(() => {
									// For now, always show single, double, triple insulation rows
									const layersArr: Array<"single" | "double" | "triple"> = [
										"single",
										"double",
										"triple",
									];
									return (
										<div className="overflow-x-auto">
											<table className="min-w-full text-xs border mb-2">
												<thead>
													<tr className="bg-muted">
														<th className="px-2 py-1 border">Type</th>
														<th className="px-2 py-1 border">Min OD (in)</th>
														<th className="px-2 py-1 border">Nom OD (in)</th>
														<th className="px-2 py-1 border">Max OD (in)</th>
														<th className="px-2 py-1 border">
															Insulation Wall/Layers (in)
														</th>
														<th className="px-2 py-1 border">Part Number</th>
														<th className="px-2 py-1 border">Note</th>
													</tr>
												</thead>
												<tbody>
													{layersArr.map((layer) => {
														const wall = getInsulationWall(
															insulationType,
															layer,
														);
														const bareSpec = findBareLitzSpec(
															strandsNum,
															awgNum,
															magnetGrade,
														);
														const nomBare = bareSpec
															? Number.parseFloat(bareSpec.nominalODIn)
															: null;
														const minBare = nomBare ? nomBare * 0.97 : null;
														const maxBare = nomBare ? nomBare * 1.03 : null;
														const layersNum =
															layer === "single"
																? 1
																: layer === "double"
																	? 2
																	: 3;
														// 6% rule
														const minWall6 = nomBare ? nomBare * 0.06 : null;
														const totalWall = wall ? wall * layersNum : null;
														const usedWall =
															totalWall !== null && minWall6 !== null
																? Math.max(totalWall, minWall6)
																: totalWall;
														const usedWallNote =
															totalWall !== null &&
															minWall6 !== null &&
															minWall6 > totalWall
																? "6% rule applied"
																: "";
														const nomOD =
															nomBare && usedWall !== null
																? nomBare + 2 * usedWall
																: null;
														const minOD =
															minBare && usedWall !== null
																? minBare + 2 * usedWall
																: null;
														const maxOD =
															maxBare && usedWall !== null
																? maxBare + 2 * usedWall
																: null;
														const partPrefix =
															layer === "single"
																? "S"
																: layer === "double"
																	? "D"
																	: "T";
														const wallStr = wall
															? `-${(wall * 1000).toFixed(1)}`
															: "";
														const partNumber =
															`${partPrefix}XXL${strandsNum || "---"}/${awgNum || "--"}PX${insulationType[0] || "X"}X${wallStr}(${magnetGrade})`.replace(
																/\s+/g,
																"",
															);
														const warning = getInsulatedWarning(
															insulationType,
															layer,
															awgNum,
														);
														return (
															<tr key={layer}>
																<td className="px-2 py-1 border font-semibold capitalize">
																	{layer} Insulated
																</td>
																<td className="px-2 py-1 border">
																	{minOD ? minOD.toFixed(3) : "-"}
																</td>
																<td className="px-2 py-1 border">
																	{nomOD ? nomOD.toFixed(3) : "-"}
																</td>
																<td className="px-2 py-1 border">
																	{maxOD ? maxOD.toFixed(3) : "-"}
																</td>
																<td className="px-2 py-1 border">
																	{wall
																		? `${wall.toFixed(4)} x ${layersNum}`
																		: "CONSULT FACTORY"}
																</td>
																<td className="px-2 py-1 border font-mono">
																	{partNumber}
																</td>
																<td className="px-2 py-1 border text-xs text-amber-700">
																	{usedWallNote}
																</td>
															</tr>
														);
													})}
												</tbody>
											</table>
											{/* Show warning if needed for any row */}
											{layersArr.map((layer) => {
												const warning = getInsulatedWarning(
													insulationType,
													layer,
													awgNum,
												);
												return warning ? (
													<div
														key={layer}
														className="text-xs text-red-600 mb-1"
													>
														{warning}
													</div>
												) : null;
											})}
										</div>
									);
								})()}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
