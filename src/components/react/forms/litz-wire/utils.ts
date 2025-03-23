import type { FormValues } from "./types";

/**
 * Generates a part number for a litz wire based on the form values
 * Format: RL-strands-strand_size_enamel_grade[-serve]-identifier
 * Example: RL-2500-44S77-SN-XX
 * @param values Form values
 * @returns Generated part number
 */
export function generatePartNumber(values: FormValues): string {
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
