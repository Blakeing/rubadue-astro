export interface InsulatedLitzSpec extends Record<string, unknown> {
	partNumber: string;
	equivalentAWG: string;
	coreDiameter: string;
	circularMils: string;
	numberOfStrands: string;
	awgOfStrands: string;
	nominalOD: string;
	suggestedOperatingFreq: string;
}

export type SingleInsulatedLitzSpec = InsulatedLitzSpec;
export type DoubleInsulatedLitzSpec = InsulatedLitzSpec;
export type TripleInsulatedLitzSpec = InsulatedLitzSpec;
