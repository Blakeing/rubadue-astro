import type { FormValues } from "./types";

/**
 * Generates a part number for a litz wire based on the form values
 * @param values Form values
 * @returns Generated part number
 */
export function generatePartNumber(values: FormValues): string {
	const {
		conductor,
		magnetWireSize,
		strands,
		insulation,
		color,
		magnetWireGrade,
	} = values;

	// Validate all required fields are present
	if (
		!conductor ||
		!magnetWireSize ||
		!strands ||
		!insulation ||
		!color ||
		!magnetWireGrade
	) {
		throw new Error("All fields are required to generate a part number");
	}

	// Format the magnet wire size to be 2 digits
	const formattedSize = Number(magnetWireSize).toString().padStart(2, "0");

	// Format the strands to be 3 digits
	const formattedStrands = Number(strands).toString().padStart(3, "0");

	// Combine all parts to create the part number
	// Format: L{conductor}{size}{strands}{insulation}{color}{grade}
	// Example: LC36042HN1 = Copper, 36 AWG, 42 strands, Heavy insulation, Natural color, Grade 1
	return `L${conductor}${formattedSize}${formattedStrands}${insulation}${color}${magnetWireGrade}`;
}
