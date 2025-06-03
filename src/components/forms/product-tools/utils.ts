import type {
	AWGValue,
	CalculationResults,
	FormValues,
	InsulatedWireFormValues,
	LitzWireFormValues,
	MaterialKey,
	TemperatureUnit,
} from "./types";
import { awgData, materialPresets } from "./types";

/**
 * Convert temperature from Fahrenheit to Celsius
 * @param fahrenheit Temperature in Fahrenheit
 * @returns Temperature in Celsius
 */
export const fahrenheitToCelsius = (fahrenheit: number): number =>
	(fahrenheit - 32) * (5 / 9);

/**
 * Convert temperature from Celsius to Fahrenheit
 * @param celsius Temperature in Celsius
 * @returns Temperature in Fahrenheit
 */
export const celsiusToFahrenheit = (celsius: number): number =>
	celsius * (9 / 5) + 32;

/**
 * Convert length from feet to meters
 * @param feet Length in feet
 * @returns Length in meters
 */
const feetToMeters = (feet: number): number => feet * 0.3048;

/**
 * Convert length from meters to feet
 * @param meters Length in meters
 * @returns Length in feet
 */
const metersToFeet = (meters: number): number => meters * 3.28084;

/**
 * Calculate resistivity at a given temperature
 * @param baseResistivity Base resistivity at room temperature (20°C)
 * @param tempCoeff Temperature coefficient of resistance
 * @param temperature Current temperature
 * @param unit Temperature unit (F or C)
 * @returns Resistivity at the given temperature
 */
export const calculateResistivity = (
	baseResistivity: number,
	tempCoeff: number,
	temperature: number,
	unit: TemperatureUnit,
): number => {
	// Convert to Celsius if needed
	const temperatureC =
		unit === "F" ? fahrenheitToCelsius(temperature) : temperature;
	// Calculate resistivity at given temperature using the formula:
	// ρ(T) = ρ₀[1 + α(T - T₀)]
	// where T₀ is room temperature (20°C)
	return baseResistivity * (1 + tempCoeff * (temperatureC - 20));
};

/**
 * Calculate N1 Max and related values
 * @param data Form values
 * @param material Selected material
 * @param unit Temperature unit
 * @returns Calculation results
 */
export const calculateResults = (
	data: FormValues,
	material: MaterialKey,
	unit: TemperatureUnit,
): CalculationResults => {
	const resistivity = calculateResistivity(
		materialPresets[material].baseResistivity,
		materialPresets[material].tempCoeff,
		data.temperature,
		unit,
	);
	const conductivity = 1 / resistivity;
	const skinDepth =
		1 / Math.sqrt(Math.PI * data.frequency * data.permeability * conductivity);
	const strandDiameter = awgData[data.awg] / 1000; // Convert mm to meters
	const n1Max = Math.floor(
		(4 * (skinDepth * skinDepth)) / (strandDiameter * strandDiameter),
	);

	return {
		skinDepth,
		doubleSkinDepth: 2 * skinDepth,
		n1Max,
		resistivity,
	};
};

// === INSULATED WINDING WIRE UTILS ===

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
export function generatePartNumber(
	values: InsulatedWireFormValues | LitzWireFormValues,
): string {
	// Check if it's a litz wire form
	if ("numberOfStrands" in values) {
		return generateLitzPartNumber(values as LitzWireFormValues);
	}

	// Handle insulated wire form
	const insulatedValues = values as InsulatedWireFormValues;
	const isLitz = insulatedValues.conductor === "L";
	const formattedAwgSize = formatAwgSize(insulatedValues.awgSize);
	const colorWithX = formatColorWithX(
		insulatedValues.color,
		insulatedValues.layers,
	);

	if (isLitz) {
		// Litz wire format
		const strandInfo =
			insulatedValues.strands && insulatedValues.magnetWireSize
				? `${insulatedValues.strands}/${insulatedValues.magnetWireSize}`
				: "";
		const magnetWireGrade = insulatedValues.magnetWireGrade
			? `(${insulatedValues.magnetWireGrade})`
			: "";

		return `${insulatedValues.layers}XXL${strandInfo}${insulatedValues.insulation}${colorWithX}${insulatedValues.thickness === "invalid" ? "" : insulatedValues.thickness}${magnetWireGrade}`;
	}

	// Standard wire format
	return `${insulatedValues.layers}${formattedAwgSize}${insulatedValues.conductor}${insulatedValues.strands}${insulatedValues.insulation}${colorWithX}${insulatedValues.thickness === "invalid" ? "" : insulatedValues.thickness}`;
}

// === LITZ WIRE UTILS ===

/**
 * Generates a part number for a litz wire based on the form values
 * Format: RL-strands-strand_size_enamel_grade[-serve]-identifier
 * Example: RL-2500-44S77-SN-XX
 * @param values Form values
 * @returns Generated part number
 */
export function generateLitzPartNumber(values: LitzWireFormValues): string {
	const {
		numberOfStrands,
		strandSize,
		insulation,
		magnetWireGrade,
		serveLayers,
		uniqueIdentifier,
	} = values;

	const parts = ["RL"];
	const middleParts = [];

	// Add number of strands (show placeholder if empty)
	if (numberOfStrands) {
		const num = Number(numberOfStrands);
		if (num < 1000) {
			parts.push(num.toString().padStart(4, ""));
		} else {
			parts.push(num.toString());
		}
	} else {
		parts.push("XXXX");
	}

	// Add strand size (show placeholder if empty)
	if (strandSize) {
		middleParts.push(strandSize);
	} else {
		middleParts.push("XX");
	}

	// Add enamel build (show placeholder if empty)
	if (insulation) {
		middleParts.push(insulation);
	} else {
		middleParts.push("X");
	}

	// Add magnet wire grade (show placeholder if empty)
	if (magnetWireGrade) {
		middleParts.push(magnetWireGrade.replace("MW", ""));
	} else {
		middleParts.push("XX");
	}

	// Join middle parts without hyphens
	parts.push(middleParts.join(""));

	// Add serve layers if selected and not "none"
	if (serveLayers && serveLayers !== "none") {
		parts.push(serveLayers);
	}

	// Add unique identifier (defaults to XX)
	parts.push(uniqueIdentifier || "XX");

	return parts.join("-");
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
			'Double Insulated (2), Litz Wire, 360 Strands of 44 AWG, ETFE, Orange with X suffix, .0015"/layer, MW79',
	},
	{
		id: "example-3",
		number: "RL-2500-44S77-SN-XX",
		description:
			"Litz Wire, 2500 Strands, 44 AWG, Single Enamel, MW77, Single Nylon Serve",
	},
] as const;
