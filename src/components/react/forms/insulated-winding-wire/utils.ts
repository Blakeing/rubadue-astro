import type { FormValues } from "./types";

/**
 * Formats an AWG size to be 2 digits
 * @param awgSize - The AWG size to format
 * @returns The formatted AWG size
 */
export function formatAwgSize(awgSize: string): string {
	if (!awgSize || awgSize === "XX") return awgSize;
	const num = Number(awgSize);
	return !Number.isNaN(num) ? awgSize.padStart(2, "0") : awgSize;
}

/**
 * Adds X's after color based on layers
 * @param color - The color code
 * @param layers - The number of layers
 * @returns The color code with X's appended based on layers
 */
export function formatColorWithX(color: string, layers: string): string {
	if (!color) return color;
	if (layers === "D") return `${color}X`;
	if (layers === "T") return `${color}XX`;
	return color;
}

/**
 * Generates a part number from form values
 * @param values - The form values
 * @returns The generated part number
 */
export function generatePartNumber(values: FormValues): string {
	const isLitz = values.conductor === "L";
	const formattedAwgSize = formatAwgSize(values.awgSize);
	const colorWithX = formatColorWithX(values.color, values.layers);

	if (isLitz) {
		// Litz wire format
		const strandInfo =
			values.strands && values.magnetWireSize
				? `${values.strands}/${values.magnetWireSize}`
				: "";
		const magnetWireGrade = values.magnetWireGrade
			? `(${values.magnetWireGrade})`
			: "";

		return `${values.layers}XXL${strandInfo}${values.insulation}${colorWithX}${values.thickness}${magnetWireGrade}`;
	}

	// Standard wire format
	return `${values.layers}${formattedAwgSize}${values.conductor}${values.strands}${values.insulation}${colorWithX}${values.thickness}`;
}

/**
 * Example part numbers with descriptions
 */
export const EXAMPLE_PART_NUMBERS = [
	{
		id: "example-1",
		number: "S14A19F1-5",
		description:
			'Single Insulated (1), 14 AWG, Tin Plated Copper, 19 Strands, FEP, Brown, .0015"/layer',
	},
	{
		id: "example-2",
		number: "DXXL360/44T3X-1.5(MW79)",
		description:
			'Double Insulated (2), Litz Wire, 360 Strands of 44 AWG, ETFE, Orange with X suffix, .0015"/layer, MW79 grade',
	},
] as const;
