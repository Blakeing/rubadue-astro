/**
 * Base interface for insulated litz wire specifications
 */
export interface InsulatedLitzSpec {
	/** Part number of the wire */
	partNumber: string;
	/** Equivalent AWG size */
	equivalentAWG?: string | number;
	/** Core diameter in inches */
	coreDiameter?: string | number;
	/** Circular mils */
	circularMils?: string | number;
	/** Number of strands */
	numberOfStrands?: string | number;
	/** AWG size of individual strands */
	awgOfStrands?: string | number;
	/** Nominal outer diameter in inches */
	nominalOD?: string | number;
	/** Suggested operating frequency */
	suggestedOperatingFreq?: string;
}

/**
 * Interface for single insulated litz wire specifications
 */
export interface SingleInsulatedLitzSpec extends InsulatedLitzSpec {
	/** Additional properties specific to single insulated litz wire can be added here */
}

/**
 * Interface for double insulated litz wire specifications
 */
export interface DoubleInsulatedLitzSpec extends InsulatedLitzSpec {
	/** Additional properties specific to double insulated litz wire can be added here */
}

/**
 * Interface for triple insulated litz wire specifications
 */
export interface TripleInsulatedLitzSpec extends InsulatedLitzSpec {
	/** Additional properties specific to triple insulated litz wire can be added here */
} 